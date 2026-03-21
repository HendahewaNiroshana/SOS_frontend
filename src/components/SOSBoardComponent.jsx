import React, { useState, useEffect } from 'react';
import '../css/Board.css';

const SOSBoardComponent = ({ gameData, user, socket }) => {
    const [grid, setGrid] = useState(Array(9).fill(null));
    const [selectedLetter, setSelectedLetter] = useState('S');
    const [scores, setScores] = useState({ host: 0, opponent: 0 });
    const [turn, setTurn] = useState(gameData.player_v);
    const [results, setResults] = useState(null);

    useEffect(() => {
        socket.on('receive_move', (data) => {
            setGrid(data.newGrid);
            setScores(data.newScores);
            setTurn(data.nextTurn);
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

    const checkWin = (newGrid) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
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
        const isFull = newGrid.every(cell => cell !== null);

        let nextScores = { ...scores };
        if (isScored) {
            const role = (user.username === gameData.player_v) ? 'host' : 'opponent';
            nextScores[role] += 1;
        }

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
            newGrid: (isScored || (isFull && !isScored)) ? Array(9).fill(null) : newGrid,
            newScores: nextScores,
            nextTurn: isScored ? user.username : (turn === gameData.player_v ? gameData.player_o : gameData.player_v),
            isScored: isScored || (isFull && !isScored)
        });
    };

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
                    <button className="rematch-btn" onClick={() => window.location.reload()}>PLAY AGAIN</button>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <div className="board-wrapper">
                <header className="game-header">
                    <h1 className="logo-text">SOS <span>ONLINE</span></h1>
                </header>

                <div className="modern-scores">
                    <div className={`player-card ${turn === gameData.player_v ? 'active' : ''}`}>
                        <span className="p-name">{gameData.player_v}</span>
                        <div className="p-score">{scores.host}</div>
                    </div>
                    <div className="score-divider">:</div>
                    <div className={`player-card ${turn === gameData.player_o ? 'active' : ''}`}>
                        <span className="p-name">{gameData.player_o}</span>
                        <div className="p-score">{scores.opponent}</div>
                    </div>
                </div>

                <div className="grid-container">
                    <div className="grid-3x3">
                        {grid.map((cell, i) => (
                            <div 
                                key={i} 
                                className={`cell-item ${cell ? 'filled' : ''} ${cell === 'S' ? 's-glow' : 'o-glow'}`} 
                                onClick={() => handleMove(i)}
                            >
                                <span className={cell === 'S' ? 'signature-s' : ''}>{cell}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="footer-controls">
                    <div className="selection-bar">
                        <button className={selectedLetter === 'S' ? 'sel' : ''} onClick={() => setSelectedLetter('S')}>S</button>
                        <button className={selectedLetter === 'O' ? 'sel' : ''} onClick={() => setSelectedLetter('O')}>O</button>
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