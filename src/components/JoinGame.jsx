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
                // 1. මුලින්ම Socket room එකට Join වෙන්න
                socket.emit('join_room', gid);

                // 2. තත්පරයකින් 1/10ක් පමණ ඉඳලා Host ට signal එක යවන්න (Race condition fix)
                setTimeout(() => {
                    socket.emit('player_joined', { gameId: gid, username: user.username });
                    
                    // 3. Joiner ව Board එකට මාරු කරන්න
                    onJoinSuccess({
                        gameId: gid,
                        player_v: data.gameData.player_v, // Host ගේ නම DB එකෙන් එනවා
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
        <div className="join-card">
            <h2>Join a Game</h2>
            <form onSubmit={handleJoin}>
                <input 
                    type="text" 
                    placeholder="ENTER 6-DIGIT ID" 
                    maxLength="6"
                    value={inputID}
                    onChange={(e) => setInputID(e.target.value)}
                    className="join-input"
                />
                <button type="submit" className="join-btn" disabled={loading}>
                    {loading ? "Joining..." : "START PLAYING"}
                </button>
            </form>
        </div>
    );
};

export default JoinGame;