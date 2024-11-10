import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ userId, username }) => {
  const [scores, setScores] = useState([]); // To hold PHQ-9 scores
  const navigate = useNavigate();

  // Fetch user's PHQ-9 scores from the database
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/phq-test/${userId}`);
        setScores(response.data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };
    
    fetchScores();
  }, [userId]);

  // Handle logout
  const handleLogout = () => {
    // Clear any session data (e.g., tokens) if necessary
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Side Panel */}
      <div className="side-panel">
        <div className="user-info">
          <h2>Welcome {username} !</h2>
        </div>
        <div className="logout">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h1>PHQ-9 Test Scores</h1>
        <table className="score-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.length > 0 ? (
              scores.map((score) => (
                <tr key={score._id}>
                  <td>{new Date(score.date).toLocaleDateString()}</td>
                  <td>{new Date(score.date).toLocaleTimeString()}</td>
                  <td>{score.score}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No test scores available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
