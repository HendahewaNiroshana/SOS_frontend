import React from 'react';
import '../css/AboutUs.css';

const AboutUs = ({ onBack }) => {
    return (
        <div className="about-container">
            <button className="back-btn" onClick={onBack}>
                <span className="arrow">←</span> BACK
            </button>
            
            <header className="about-header">
                <h1 className="glow-text-blue">THE CREATORS</h1>
                <div className="header-line"></div>
                <p className="subtitle">Bringing the classic SOS experience to the digital age.</p>
            </header>

            <div className="creators-grid">
                {/* Mishad Vihanga */}
                <div className="creator-card neon-boundary">
                    <div className="profile-wrapper">
                        <div className="profile-img-placeholder">MV</div>
                    </div>
                    <h3>Mishad Vihanga</h3>
                    <p className="role">Lead Developer</p>
                    <p className="bio">Full-stack enthusiast and Software Engineering student at University of Plymouth. Passionate about building real-time applications and sleek UIs.</p>
                    
                    <div className="social-links">
                        <a href='mailto:mishadvihanga23@gmail.com' className="social-btn email">Email Me</a>
                        <a href='https://www.linkedin.com/in/mishad-vihanga-31b6723a3/' target="_blank" rel="noreferrer" className="social-btn linkedin">LinkedIn</a>
                    </div>
                </div>

                {/* Anumi Samaranayaka */}
                <div className="creator-card neon-boundary">
                    <div className="profile-wrapper">
                        <div className="profile-img-placeholder partner">AS</div>
                    </div>
                    <h3>Anumi Samaranayaka</h3>
                    <p className="role">Co-Creator & Design Support</p>
                    <p className="bio">Contributed to the creative direction and UI/UX testing, ensuring every move in SOS feels as nostalgic as the original paper-and-pen game.</p>
                    
                    <div className="social-links">
                        <a href='https://www.linkedin.com/in/anumi-samaranayaka-2078783b8/' target="_blank" rel="noreferrer" className="social-btn linkedin">LinkedIn Profile</a>
                    </div>
                </div>
            </div>

            <footer className="about-footer">
                <div className="footer-content">
                    <span className="brand">ProgLife Visuals</span>
                    <span className="separator">|</span>
                    <span className="year">2026</span>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;