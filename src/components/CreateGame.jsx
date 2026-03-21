import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import '../css/CreateGame.css';

const CreateGame = ({ user, socket }) => {
    const [gameId, setGameId] = useState('');
    const [isCreated, setIsCreated] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateID = () => {
        const id = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGameId(id);
    };

    const handleCreate = async () => {
        if (!gameId) return alert("Generate an ID first!");
        
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/game/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, gameId: gameId })
            });

            if (res.ok) {
                setIsCreated(true);
                // Host ව Socket Room එකට ඇතුළු කිරීම (Signal එක එනකම් ඉන්න)
                socket.emit('join_room', gameId);
            } else {
                alert("Failed to create game. Try another ID.");
            }
        } catch (err) {
            alert("Connection error to Backend!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-card">
            <h2>Host a Game</h2>
            {!isCreated ? (
                <div className="setup-area">
                    <div className="id-box">{gameId || "------"}</div>
                    <button onClick={generateID} className="gen-btn">Generate ID</button>
                    <button onClick={handleCreate} className="create-btn" disabled={loading}>
                        {loading ? "Creating..." : "Create Room"}
                    </button>
                </div>
            ) : (
                <div className="waiting-area">
                    <p>Share this code with your friend:</p>
                    <div className="share-code">{gameId}</div>
                    <div className="spinner"></div>
                    <p className="blink">Waiting for opponent to join...</p>
                </div>
            )}
        </div>
    );
};

export default CreateGame;