// App.tsx - Main entry point for React Router and app structure
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing'; // Landing page for non-authenticated users
import Home from './Home'; // Dashboard for authenticated users
import Login from './Login'; // Login page
import Scraper from './Scraper'; // Scraper tool page
import Account from './Account'; // Account page
import SignUp from './SignUp'; // SignUp page
import ProjectResults from './ProjectResults'; // Project results page
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import ErrorPage from './ErrorPage'; // Error page
import './App.css';

// Simple component: if user has token, go to dashboard, otherwise show landing
const AuthenticatedRedirect: React.FC = () => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Landing />;
};

// The App component sets up all main routes for the application
function App() {
  return (
    <Router>
      {/* Define all main routes for the app */}
      <Routes>
        <Route path="/" element={<AuthenticatedRedirect />} />
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
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
