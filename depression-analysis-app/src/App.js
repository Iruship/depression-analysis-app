import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import PHQTest from './components/PHQTest';
import LiveDepressionDetection from './components/LiveDepressionDetection';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const isLoggedIn = !!localStorage.getItem('userId');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/phq-test" element={<PHQTest />} />
        <Route path="/live-depression-detection" element={<LiveDepressionDetection />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
