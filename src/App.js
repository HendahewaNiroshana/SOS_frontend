import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import Home from './pages/Home';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sos_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('sos_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sos_user');
  };

  return (
    <div className="App">
      {user ? (
        <Home user={user} onLogout={handleLogout} />
      ) : (
        <Auth onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;