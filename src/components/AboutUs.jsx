import React from 'react';
import '../css/AboutUs.css';

const AboutUs = ({ onBack }) => {
    return (
        <div className="about-container">
            <button className="back-btn" onClick={onBack}>← BACK TO GAME</button>
            
            <header className="about-header">
                <h1 className="glow-text-blue">THE CREATORS</h1>
                <p className="subtitle">Bringing the classic SOS experience to the digital age.</p>
            </header>

            <div className="creators-grid">
                {/* Your Profile */}
                <div className="creator-card neon-boundary">
                    <div className="profile-img-placeholder">MV</div> 
                    <h3>Mishad Vihanga</h3>
                    <p className="role">Lead Developer</p>
                    <p className="bio">Full-stack enthusiast and Software Engineering student at University of Plymouth. Passionate about building real-time applications and sleek UIs.</p>
                    <p className="bio"><a href='mailto:mishadvihanga23@gmail.com'>mishadvihanga23@gmail.com</a></p>
                    <p className="bio"><a href='https://www.linkedin.com/in/mishad-vihanga-31b6723a3/'>LinkedIn Profile</a></p>

                </div>

                {/* Partner's Profile */}
                <div className="creator-card neon-boundary">
                    <div className="profile-img-placeholder partner">❤️</div>
                    <h3>Anumi Samaranayaka</h3>
                    <p className="role">Co-Creator & Design Support</p>
                    <p className="bio">Contributed to the creative direction and UI/UX testing, ensuring every move in SOS feels as nostalgic as the original paper-and-pen game.</p>
                    <p className="bio"><a href='https://www.linkedin.com/in/anumi-samaranayaka-2078783b8/'>LinkedIn Profile</a></p>
                </div>
            </div>

            <footer className="about-footer">
                <p>ProgLife Visuals</p>
                <div className="tech-stack-mini">
                    
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;