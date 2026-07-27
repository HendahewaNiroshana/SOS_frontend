import React, { useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { db } from '../firebase';
import '../css/CreateGame.css';

const JoinGame = ({ user, onJoinSuccess }) => {
  const [inputID, setInputID] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    const gid = inputID.toUpperCase().trim();
    if (!gid) return;

    setLoading(true);
    try {
      const gameRef = ref(db, `games/${gid}`);
      const snapshot = await get(gameRef);

      if (snapshot.exists()) {
        const gameData = snapshot.val();
        
        if (gameData.player_o && gameData.player_o !== user.username) {
          alert("Room is already full!");
          setLoading(false);
          return;
        }

        // Firebase එක update කිරීම
        const updates = {
          player_o: user.username,
          status: 'playing'
        };

        await update(gameRef, updates);

        onJoinSuccess({
          ...gameData,
          ...updates
        });
      } else {
        alert("Game ID not found!");
      }
    } catch (err) {
      alert("Error connecting to Firebase Database!");
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
          onChange={(e) => setInputID(e.target.value.toUpperCase())} 
          className="join-input-modern"
        />
        
        <button type="submit" className="join-btn-modern" disabled={loading}>
          {loading ? <div className="btn-loader"></div> : "ENTER ARENA"}
        </button>
      </form>
    </div>
  );
};

export default JoinGame;