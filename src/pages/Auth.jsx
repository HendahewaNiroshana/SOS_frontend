import React, { useState } from 'react';
import '../css/Auth.css';

const Auth = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Enter a valid username!");
    
    // Express backend auth එක වෙනුවට direct player log කරගැනීම
    onLoginSuccess({ username: username.trim() });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>SOS Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
          <button type="submit">Play Now</button>
        </form>
      </div>
    </div>
  );
};

export default Auth;