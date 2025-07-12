// App.tsx - Main entry point for React Router and app structure
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Home page
import Login from './Login'; // Login page
import Dashboard from './Dashboard'; // Dashboard page
import Scraper from './Scraper'; // Scraper tool page
import Account from './Account'; // Account page
import './App.css';

// The App component sets up all main routes for the application
function App() {
  return (
    <Router>
      {/* Define all main routes for the app */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scraper" element={<Scraper />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
