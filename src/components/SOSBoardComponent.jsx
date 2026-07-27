import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebase';
import '../css/Board.css';

const SOSBoardComponent = ({ gameData, user }) => {
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ host: 0, opponent: 0 });
  const [turn, setTurn] = useState(gameData.player_v);
  const [results, setResults] = useState(null);
  
  // Selected Column එක සටහන් කරගැනීමට (0, 1, හෝ 2)
  const [selectedColumn, setSelectedColumn] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  // Host ට 'S' ද, Opponent ට 'O' ද auto Assign කිරීම
  const isHost = user.username === gameData.player_v;
  const assignedLetter = isHost ? 'S' : 'O';

  // Real-time Firebase Sync
  useEffect(() => {
    const gameRef = ref(db, `games/${gameData.gameId}`);
    
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setGrid(data.grid || Array(9).fill(null));
      setScores(data.scores || { host: 0, opponent: 0 });
      setTurn(data.turn);

      if (data.isScored && data.message) {
        setPopupMsg(data.message);
        setShowPopup(true);
      }

      if (data.winner) {
        setResults({
          host_score: data.scores.host,
          opponent_score: data.scores.opponent,
          winner: data.winner
        });
      }
    });

    return () => unsubscribe();
  }, [gameData.gameId]);

  const checkWin = (newGrid) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (let l of lines) {
      const [a, b, c] = l;
      if (newGrid[a] && newGrid[a] === newGrid[b] && newGrid[a] === newGrid[c]) return true;
    }
    return false;
  };

  // Popup එක ක්ලික් කළ විට Grid එක Reset කිරීම
  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedColumn(null);
    
    update(ref(db, `games/${gameData.gameId}`), {
      grid: Array(9).fill(null),
      isScored: false,
      message: ""
    });
  };

  const handleMove = async (index) => {
    if (turn !== user.username || grid[index] || results || showPopup) return;

    // Direct assignedLetter (S හෝ O) එක Grid එකට ඇතුළත් කිරීම
    const newGrid = [...grid];
    newGrid[index] = assignedLetter;

    // Selected Cell එක පිහිටි Column එක Highlight කිරීම (0, 1, හෝ 2)
    const colIndex = index % 3;
    setSelectedColumn(colIndex);

    const isScored = checkWin(newGrid);
    const isFull = newGrid.every(cell => cell !== null);

    let nextScores = { ...scores };
    let msg = "";

    if (isScored) {
      const role = isHost ? 'host' : 'opponent';
      nextScores[role] += 1;
      msg = `${user.username.toUpperCase()} SCORED! 🎯`;
    } else if (isFull) {
      msg = "IT'S A DRAW! 🤝";
    }

    let winnerName = null;
    if (nextScores.host >= 3 || nextScores.opponent >= 3) {
      winnerName = nextScores.host > nextScores.opponent ? gameData.player_v : gameData.player_o;
    }

    const nextTurnUser = isScored ? user.username : (turn === gameData.player_v ? gameData.player_o : gameData.player_v);

    await update(ref(db, `games/${gameData.gameId}`), {
      grid: newGrid,
      scores: nextScores,
      turn: nextTurnUser,
      isScored: isScored || isFull,
      message: msg,
      winner: winnerName
    });
  };

  if (results) {
    return (
      <div className="finish-overlay">
        <div className="vs-card">
          <h2 className="glow-text">MATCH ENDED</h2>
          <div className="vs-stats">
            <div className="player-stat">
              <h3>{gameData.player_v} (S)</h3>
              <p className="big-score">{results.host_score}</p>
            </div>
            <div className="vs-badge">VS</div>
            <div className="player-stat">
              <h3>{gameData.player_o} (O)</h3>
              <p className="big-score">{results.opponent_score}</p>
            </div>
          </div>
          <h1 className="winner-tag">{results.winner} WON! 🏆</h1>
          <button className="rematch-btn" onClick={() => window.location.reload()}>PLAY AGAIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      {showPopup && (
        <div className="popup-overlay">
          <div className="modern-popup neon-boundary">
            <div className="confetti-icon">🎉</div>
            <h2>{popupMsg}</h2>
            <button className="popup-ok-btn" onClick={handlePopupClose}>CONTINUE</button>
          </div>
        </div>
      )}

      <div className="compact-board">
        <header className="game-header">
          <h1 className="logo-text">SOS <span>ONLINE</span></h1>
        </header>

        <div className="modern-scores">
          <div className={`player-card neon-box ${turn === gameData.player_v ? 'active' : ''}`}>
            <span className="p-name">{gameData.player_v} (S)</span>
            <div className="p-score">{scores.host}</div>
          </div>
          <div className="score-divider">:</div>
          <div className={`player-card neon-box ${turn === gameData.player_o ? 'active' : ''}`}>
            <span className="p-name">{gameData.player_o} (O)</span>
            <div className="p-score">{scores.opponent}</div>
          </div>
        </div>

        <div className="grid-container">
          <div className="grid-3x3">
            {grid.map((cell, i) => {
              const colIndex = i % 3;
              const isColSelected = selectedColumn === colIndex;

              return (
                <div 
                  key={i} 
                  className={`cell-item ${cell ? 'filled' : 'empty'} ${cell === 'S' ? 's-glow' : ''} ${cell === 'O' ? 'o-glow' : ''} ${isColSelected ? 'col-active' : ''}`} 
                  onClick={() => handleMove(i)}
                >
                  <span className={cell === 'S' ? 'signature-s' : ''}>
                    {cell || ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="footer-controls">
          <div className="assigned-letter-badge neon-boundary">
            YOUR LETTER: <strong className="highlight-letter">{assignedLetter}</strong>
          </div>
          <p className="turn-indicator">
            {turn === user.username ? "⚡ YOUR TURN" : "⌛ OPPONENT'S TURN"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SOSBoardComponent;