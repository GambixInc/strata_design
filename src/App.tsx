// App.tsx - Main entry point for React Router and app structure
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing'; // Landing page for non-authenticated users
import Home from './Home'; // Dashboard for authenticated users
import Login from './Login'; // Login page
import Scraper from './Scraper'; // Scraper tool page
import Account from './Account'; // Account page
import SignUp from './SignUp'; // SignUp page
import ProjectResults from './ProjectResults'; // Project results page
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// The App component sets up all main routes for the application
function App() {
  return (
    <Router>
      {/* Define all main routes for the app */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/scraper" element={
          <ProtectedRoute>
            <Scraper />
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/project/:id" element={
          <ProtectedRoute>
            <ProjectResults />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
