import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
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
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('username', username);
      toast.success('Login successful');
      navigate('/onboarding');
    } catch (error) {
      toast.error('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        username,
        email,
        password,
      });
      toast.success(response.data.message);
      setIsSignup(false);
    } catch (error) {
      toast.error('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="curved-background">
        <h1 className="left-title">Are You In Problem?</h1>
      </div>
      <h2 className="right-title">Check Your Depression Level</h2>
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
                className="btn btn-secondary"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
