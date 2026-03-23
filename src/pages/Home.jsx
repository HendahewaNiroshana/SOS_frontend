import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import CreateGame from '../components/CreateGame';
import JoinGame from '../components/JoinGame';
import SOSBoardComponent from '../components/SOSBoardComponent';
import AboutUs from '../components/AboutUs'; // AboutUs component එක import කරන්න
import '../css/Home.css';

const Home = ({ user, onLogout }) => {
    const [view, setView] = useState('home'); 
    const [currentGameData, setCurrentGameData] = useState(null);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true
        });

        socketRef.current.on('opponent_joined', (data) => {
            setCurrentGameData({
                gameId: data.gameId,
                player_v: user.username, 
                player_o: data.username,
                grid_size: 3 
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
                <h1 onClick={() => setView('home')} style={{cursor: 'pointer'}}>SOS ONLINE</h1>
                <div className="user-info">
                    <span>{user.username}</span>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <main className="content">
                {/* Home View */}
                {view === 'home' && (
                    <div className="menu-grid">
                        <div className="card" onClick={() => setView('create')}>Host Game</div>
                        <div className="card" onClick={() => setView('join')}>Join Game</div>
                        
                        {/* About Button - Home එකේදී පමණක් පෙන්වීමට ඇතුළතට දැම්මා */}
                        <button className="about-toggle-btn" onClick={() => setView('about')}>
                            ℹ️ ABOUT CREATORS
                        </button>
                    </div>
                )}

                {/* Create View */}
                {view === 'create' && <CreateGame user={user} socket={socketRef.current} />}
                
                {/* Join View */}
                {view === 'join' && (
                    <JoinGame user={user} socket={socketRef.current} onJoinSuccess={handleJoinSuccess} />
                )}

                {/* Playing View */}
                {view === 'playing' && currentGameData && (
                    <SOSBoardComponent 
                        gameData={currentGameData} 
                        user={user} 
                        socket={socketRef.current} 
                    />
                )}

                {/* About Us View */}
                {view === 'about' && (
                    <AboutUs onBack={() => setView('home')} />
                )}
            </main>
        </div>
    );
};

export default Home;