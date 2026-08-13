import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ScanResults from './pages/ScanResults';
import History from './pages/History';
import Profile from './pages/Profile';
import ScannerDashboard from './components/ScannerDashboard'; // <-- Imported the new component

function App() {
  return (
    <div className="dark">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Added the new route to test the n8n backend connection */}
          <Route path="/scanner" element={<ScannerDashboard />} /> 
          
          <Route path="/results" element={<ScanResults />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;