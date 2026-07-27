import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebase';
import CreateGame from '../components/CreateGame';
import JoinGame from '../components/JoinGame';
import SOSBoardComponent from '../components/SOSBoardComponent';
import AboutUs from '../components/AboutUs';
import '../css/Home.css';

const Home = ({ user, onLogout }) => {
  const [view, setView] = useState('home'); 
  const [currentGameData, setCurrentGameData] = useState(null);

  // Host එකක් create කළ පසු Opponent join වනතුරු Firebase Node එක Listen කිරීම
  useEffect(() => {
    if (currentGameData?.gameId && view === 'create') {
      const gameRef = ref(db, `games/${currentGameData.gameId}`);
      
      const unsubscribe = onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.player_o && data.status === 'playing') {
          setCurrentGameData(data);
          setView('playing');
        }
      });

      return () => off(gameRef);
    }
  }, [currentGameData?.gameId, view]);

  const handleCreateSuccess = (data) => {
    setCurrentGameData(data);
    setView('create');
  };

  const handleJoinSuccess = (data) => {
    setCurrentGameData(data);
    setView('playing');
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
        {view === 'home' && (
          <div className="menu-grid">
            <div className="card" onClick={() => setView('create')}>Host Game</div>
            <div className="card" onClick={() => setView('join')}>Join Game</div>
            <button className="about-toggle-btn" onClick={() => setView('about')}>
              ℹ️ ABOUT CREATORS
            </button>
          </div>
        )}

        {view === 'create' && (
          <CreateGame user={user} onCreateSuccess={handleCreateSuccess} />
        )}
        
        {view === 'join' && (
          <JoinGame user={user} onJoinSuccess={handleJoinSuccess} />
        )}

        {view === 'playing' && currentGameData && (
          <SOSBoardComponent gameData={currentGameData} user={user} />
        )}

        {view === 'about' && (
          <AboutUs onBack={() => setView('home')} />
        )}
      </main>
    </div>
  );
};

export default Home;