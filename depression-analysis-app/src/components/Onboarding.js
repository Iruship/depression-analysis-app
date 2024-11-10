import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      alert('Camera access granted');
      navigate('/live-stress-detection');
    } catch (error) {
      alert('Camera access denied');
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-box">
        <h2>Welcome to Mental Health App</h2>
        <p>
          This app helps assess mental health using image processing. Please
          allow camera access and take the PHQ-9 test for better insights.
        </p>
        <button onClick={requestPermissions} className="btn btn-success">
          Grant Camera Access
        </button>
        <button onClick={() => navigate('/phq-test')} className="btn btn-secondary">
          Take PHQ-9 Test
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
