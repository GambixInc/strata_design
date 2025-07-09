import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Fallback: Render the old dashboard for now */}
        <Route path="/dashboard" element={<iframe title="Dashboard" src="/dashboard.html" style={{width: '100vw', height: '100vh', border: 'none'}} />} />
        {/* Optionally, add a route for the scraper UI */}
        <Route path="/scraper" element={<iframe title="Scraper" src="/scraper_frontend.html" style={{width: '100vw', height: '100vh', border: 'none'}} />} />
      </Routes>
    </Router>
  );
}

export default App;
