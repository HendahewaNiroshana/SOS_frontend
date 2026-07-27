import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import '../css/CreateGame.css';

const CreateGame = ({ user, onCreateSuccess }) => {
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
      const initialGameData = {
        gameId: gameId,
        player_v: user.username,
        player_o: "",
        status: "waiting",
        grid: Array(9).fill(null),
        turn: user.username,
        scores: { host: 0, opponent: 0 },
        isScored: false,
        message: "",
        winner: null
      };

      // Firebase Realtime DB හි Create කිරීම
      await set(ref(db, `games/${gameId}`), initialGameData);

      setIsCreated(true);
      onCreateSuccess(initialGameData);
    } catch (err) {
      alert("Failed to create room in Firebase!");
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