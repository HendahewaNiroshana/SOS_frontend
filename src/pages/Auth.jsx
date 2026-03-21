import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import '../css/Auth.css';

const Auth = ({ onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
        
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                if (isRegister) {
                    alert("Account Created! Now login.");
                    setIsRegister(false);
                } else {
                    onLoginSuccess(data.user);
                }
            } else {
                alert(data.error || "Something went wrong!");
            }
        } catch (err) {
            alert("Server connection failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isRegister ? "Sign Up" : "SOS Login"}</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        required 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Waiting..." : (isRegister ? "Create Account" : "Play Now")}
                    </button>
                </form>
                <p onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "Back to Login" : "No account? Register here"}
                </p>
            </div>
        </div>
    );
};

export default Auth;