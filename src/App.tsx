// App.tsx - Main entry point for React Router and app structure
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing'; // Landing page for non-authenticated users
import Home from './Home'; // Dashboard for authenticated users
import Login from './Login'; // Login page
import Scraper from './Scraper'; // Scraper tool page
import Account from './Account'; // Account page
import SignUp from './SignUp'; // SignUp page
import './App.css';

// The App component sets up all main routes for the application
function App() {
  return (
    <Router>
      {/* Define all main routes for the app */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scraper" element={<Scraper />} />
        <Route path="/account" element={<Account />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
