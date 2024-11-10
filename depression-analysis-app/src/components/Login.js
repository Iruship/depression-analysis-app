import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
      navigate('/onboarding'); // Redirect to Onboarding, will change later
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        username,
        email,
        password,
      });
      alert(response.data.message);
      setIsSignup(false); // Switch back 
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
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
          {!isSignup && (
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
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
          {isSignup ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsSignup(false)}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setIsSignup(true)}
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
