import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import CreateGame from '../components/CreateGame';
import JoinGame from '../components/JoinGame';
import SOSBoardComponent from '../components/SOSBoardComponent';
import '../css/Home.css';

const Home = ({ user, onLogout }) => {
    const [view, setView] = useState('home'); 
    const [currentGameData, setCurrentGameData] = useState(null);
    const socketRef = useRef();

    useEffect(() => {
        // Socket එක Initialize කිරීම
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true
        });

        // Host හට අනෙක් ක්‍රීඩකයා ආ බව දැනුම් දීම
        socketRef.current.on('opponent_joined', (data) => {
            setCurrentGameData({
                gameId: data.gameId,
                player_v: user.username, 
                player_o: data.username,
                grid_size: 3 // 3x3 SOS grid
            });
            setView('playing');
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [user.username]);

    const handleJoinSuccess = (data) => {
        setCurrentGameData(data);
        setView('playing');
        socketRef.current.emit('join_room', data.gameId);
    };

    return (
        <div className="app-shell">
            <nav className="top-nav">
                <h1 onClick={() => setView('home')}>SOS ONLINE</h1>
                <div className="user-info">
                    <span>{user.username}</span>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </nav>

            <main className="content">
                {view === 'home' && (
                    <div className="menu-grid">
                        <div className="card" onClick={() => setView('create')}>Create Game</div>
                        <div className="card" onClick={() => setView('join')}>Join Game</div>
                    </div>
                )}

                {view === 'create' && <CreateGame user={user} socket={socketRef.current} />}
                
                {view === 'join' && (
                    <JoinGame user={user} socket={socketRef.current} onJoinSuccess={handleJoinSuccess} />
                )}

                {view === 'playing' && currentGameData && (
                    <SOSBoardComponent 
                        gameData={currentGameData} 
                        user={user} 
                        socket={socketRef.current} 
                    />
                )}
            </main>
        </div>
    );
};

export default Home;