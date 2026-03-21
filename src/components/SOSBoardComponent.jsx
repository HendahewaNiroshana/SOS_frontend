import React, { useState, useEffect } from 'react';
import '../css/Board.css';

const SOSBoardComponent = ({ gameData, user, socket }) => {
    const [grid, setGrid] = useState(Array(9).fill(null));
    const [selectedLetter, setSelectedLetter] = useState('S');
    const [scores, setScores] = useState({ host: 0, opponent: 0 });
    const [turn, setTurn] = useState(gameData.player_v);
    const [results, setResults] = useState(null);

    useEffect(() => {
        // සර්වර් එකෙන් එන දත්ත ලබා ගැනීම
        socket.on('receive_move', (data) => {
            setGrid(data.newGrid);
            setScores(data.newScores);
            setTurn(data.nextTurn);
            
            // ලකුණක් ලැබුණොත් බෝඩ් එක Reset කිරීම
            if (data.isScored) {
                setTimeout(() => setGrid(Array(9).fill(null)), 600);
            }
        });

        socket.on('display_results', (data) => {
            setResults(data);
        });

        return () => {
            socket.off('receive_move');
            socket.off('display_results');
        };
    }, [socket]);

    // SOS හෝ එකම අකුරේ ලයින් එකක් තිබේදැයි බැලීම
    const checkWin = (newGrid) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // හරස් අතට
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // සිරස් අතට
            [0, 4, 8], [2, 4, 6]             // ඇලයට
        ];
        for (let l of lines) {
            const [a, b, c] = l;
            if (newGrid[a] && newGrid[a] === newGrid[b] && newGrid[a] === newGrid[c]) return true;
        }
        return false;
    };

    const handleMove = (index) => {
        if (turn !== user.username || grid[index] || results) return;

        const newGrid = [...grid];
        newGrid[index] = selectedLetter;
        const isScored = checkWin(newGrid);

        let nextScores = { ...scores };
        if (isScored) {
            const role = (user.username === gameData.player_v) ? 'host' : 'opponent';
            nextScores[role] += 1;
        }

        // ලකුණු 3ක් ගත්තොත් ජයග්‍රාහකයා තීරණය කිරීම
        if (nextScores.host >= 3 || nextScores.opponent >= 3) {
            const winner = nextScores.host > nextScores.opponent ? gameData.player_v : gameData.player_o;
            socket.emit('game_over_save', {
                gameId: gameData.gameId,
                host_score: nextScores.host,
                opponent_score: nextScores.opponent,
                winner: winner
            });
        }

        socket.emit('make_move', {
            gameId: gameData.gameId,
            newGrid,
            newScores: nextScores,
            nextTurn: isScored ? user.username : (turn === gameData.player_v ? gameData.player_o : gameData.player_v),
            isScored
        });
    };

    // Game Over Screen
    if (results) {
        return (
            <div className="finish-overlay">
                <div className="vs-card">
                    <h2 className="glow-text">MATCH ENDED</h2>
                    <div className="vs-stats">
                        <div className="player-stat">
                            <h3>{gameData.player_v}</h3>
                            <p className="big-score">{results.host_score}</p>
                        </div>
                        <div className="vs-badge">VS</div>
                        <div className="player-stat">
                            <h3>{gameData.player_o}</h3>
                            <p className="big-score">{results.opponent_score}</p>
                        </div>
                    </div>
                    <h1 className="winner-tag">{results.winner} WON! 🏆</h1>
                    <button className="home-btn" onClick={() => window.location.reload()}>REMATCH</button>
                </div>
            </div>
        );
    }

    return (
        <div className="board-wrapper">
            {/* Score Board */}
            <div className="modern-scores">
                <div className={`player-box ${turn === gameData.player_v ? 'active-turn' : ''}`}>
                    <span>{gameData.player_v}</span>
                    <div className="score-val">{scores.host}</div>
                </div>
                <div className={`player-box ${turn === gameData.player_o ? 'active-turn' : ''}`}>
                    <span>{gameData.player_o}</span>
                    <div className="score-val">{scores.opponent}</div>
                </div>
            </div>

            {/* S or O Selector */}
            <div className="selection">
                <button className={selectedLetter === 'S' ? 'sel' : ''} onClick={() => setSelectedLetter('S')}>S</button>
                <button className={selectedLetter === 'O' ? 'sel' : ''} onClick={() => setSelectedLetter('O')}>O</button>
            </div>

            {/* 3x3 Grid */}
            <div className="grid-3x3">
                {grid.map((cell, i) => (
                    <div 
                        key={i} 
                        className={`cell-item ${cell ? 'filled' : ''}`} 
                        onClick={() => handleMove(i)}
                    >
                        {cell}
                    </div>
                ))}
            </div>

            <p className="info-msg">
                {turn === user.username ? "🔥 YOUR TURN" : "⌛ WAITING FOR OPPONENT..."}
            </p>
        </div>
    );
};

export default SOSBoardComponent;