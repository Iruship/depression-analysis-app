import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'user' && password === 'pass') {
      navigate('/onboarding');
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Sample API call for sign-up (commented out for now)
    /*
    axios.post('/api/signup', { name, username, email, password })
      .then(response => {
        console.log('User signed up:', response.data);
        setShowSignup(false);
      })
      .catch(error => {
        console.error('There was an error signing up:', error);
      });
    */
    console.log({ name, username, email, password }); // Placeholder to see form data
    setShowSignup(false); // Switch back to login view after signup
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{showSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={showSignup ? handleSignup : handleLogin}>
          {showSignup && (
            <>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}
          {!showSignup && (
            <>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          <button type="submit" className="btn btn-primary">
            {showSignup ? 'Sign Up' : 'Login'}
          </button>
          {showSignup ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowSignup(false)}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
