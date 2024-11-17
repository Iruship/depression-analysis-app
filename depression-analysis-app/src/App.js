import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import PHQTest from './components/PHQTest';
import LiveDepressionDetection from './components/LiveDepressionDetection';
import AdminDashboard from './components/AdminDashboard';
import HelpLine from './components/HelpLine';
import AboutUs from './components/AboutUs';

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
        <Route path="/help-line" element={<HelpLine />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
