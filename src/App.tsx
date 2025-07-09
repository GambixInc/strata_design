import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Optionally, add a route for the scraper UI */}
        <Route path="/scraper" element={<iframe title="Scraper" src="/scraper_frontend.html" style={{width: '100vw', height: '100vh', border: 'none'}} />} />
      </Routes>
    </Router>
  );
}

export default App;
