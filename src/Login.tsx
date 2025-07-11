// Login.tsx - Login page with mock user authentication
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

// Mock user data for demo sign-in
const mockUsers: Record<string, any> = {
  'john@techstartup.com': {
    name: 'John Smith',
    role: 'CEO, TechStartup Inc.',
    password: 'demo123',
  },
  'sarah@ecommerce.com': {
    name: 'Sarah Johnson',
    role: 'Marketing Director, E-Commerce Pro',
    password: 'demo123',
  },
  'mike@agency.com': {
    name: 'Mike Chen',
    role: 'Digital Agency Owner',
    password: 'demo123',
  },
};

const Login: React.FC = () => {
  // State for form fields and login status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle form submission and mock authentication
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Check credentials against mock user data
    if (mockUsers[email] && mockUsers[email].password === password) {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          email,
          name: mockUsers[email].name,
          role: mockUsers[email].role,
        })
      );
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-bg-grid">
      <div className="login-center-card">
        {/* Logo and headings */}
        <div className="login-logo">
          <img src="/vite.svg" alt="Logo" />
        </div>
        <h2 className="login-title">Log in to your account</h2>
        <p className="login-subtitle">Welcome back! Please enter your details.</p>
        {/* Error and success messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {/* Login form */}
        <form className="login-form-modern" onSubmit={handleSubmit}>
          <div className="form-group-modern">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group-modern">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Remember me and forgot password row */}
          <div className="login-row-between">
            <label className="remember-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <span>Remember for 30 days</span>
            </label>
            <Link to="#" className="forgot-password-link">Forgot password</Link>
          </div>
          {/* Sign in and Google sign in buttons */}
          <button type="submit" className="login-btn-modern">Sign in</button>
          <button type="button" className="google-btn-modern">
            <span className="google-icon">G</span> Sign in with Google
          </button>
        </form>
        {/* Sign up link */}
        <div className="signup-link">
          Don’t have an account? <Link to="#" className="signup-link-highlight">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 