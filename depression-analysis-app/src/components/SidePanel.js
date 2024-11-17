import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SidePanel.css';


const SidePanel = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage if needed
    // localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="side-panel">
      <div className="profile-section">
          <img src="/profile_picture.png" alt="Profile" className="profile-picture" />
          <h2>Welcome {username}</h2>
        </div>

      <div className="links-section">
        <button className="transparent-button" onClick={() => navigate('/live-depression-detection')}>
          Live Depression Detection
        </button>
        <button className="transparent-button" onClick={() => navigate('/onboarding')}>
          Onboarding
        </button>
        <button className="transparent-button" onClick={() => navigate('/phq-test')}>
          PHQ-9 Test
        </button>
        <button className="transparent-button" onClick={() => navigate('/image-upload')}>
          Image Upload
        </button>
        <button className="transparent-button" onClick={() => navigate('/help-line')}>
          Help Line
        </button>
        <button className="transparent-button" onClick={() => navigate('/about-us')}>
          About Us
        </button>
      </div>

      <div className="logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default SidePanel;
