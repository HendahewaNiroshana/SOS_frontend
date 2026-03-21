import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import '../css/CreateGame.css';

const JoinGame = ({ user, socket, onJoinSuccess }) => {
    const [inputID, setInputID] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async (e) => {
        e.preventDefault();
        const gid = inputID.toUpperCase().trim();
        if (!gid) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/game/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, gameId: gid })
            });

            const data = await res.json();

            if (res.ok) {
                socket.emit('join_room', gid);
                setTimeout(() => {
                    socket.emit('player_joined', { gameId: gid, username: user.username });
                    onJoinSuccess({
                        gameId: gid,
                        player_v: data.gameData.player_v,
                        player_o: user.username
                    });
                }, 200);
            } else {
                alert(data.error || "Game not found!");
            }
        } catch (err) {
            alert("Server connection error!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-card neon-wrapper">
            <h2 className="glow-text-blue">Join Battle</h2>
            <p className="subtitle">Enter the 6-digit room code to start</p>
            
            <form onSubmit={handleJoin} className="join-form">
                <input 
                    type="text" 
                    placeholder="CODE23" 
                    maxLength="6"
                    value={inputID}
                    // මෙතැනදී අකුරු auto-capitalization සිදු වේ
                    onChange={(e) => setInputID(e.target.value.toUpperCase())} 
                    className="join-input-modern"
                />
                
                <button type="submit" className="join-btn-modern" disabled={loading}>
                    {loading ? (
                        <div className="btn-loader"></div>
                    ) : (
                        "ENTER ARENA"
                    )}
                </button>
            </form>
        </div>
    );
};

export default JoinGame;