import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

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

const demoUserEmails = Object.keys(mockUsers);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [siteCounts, setSiteCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the real number of sites scraped by each user
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};
      await Promise.all(
        demoUserEmails.map(async (userEmail) => {
          try {
            const res = await fetch(`/api/user-sites?email=${encodeURIComponent(userEmail)}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.sites)) {
              counts[userEmail] = data.sites.length;
            } else {
              counts[userEmail] = 0;
            }
          } catch {
            counts[userEmail] = 0;
          }
        })
      );
      setSiteCounts(counts);
    };
    fetchCounts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword(mockUsers[userEmail].password);
    setTimeout(() => {
      document.getElementById('loginForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 0);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome to Strata</h1>
        <p>AI-Powered Website Optimization Platform</p>
      </div>
      <div className="login-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="back-link">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
      <div className="mock-users">
        <h3>Quick Login (Demo Users)</h3>
        {demoUserEmails.map((userEmail) => {
          const user = mockUsers[userEmail];
          return (
            <div className="user-card" key={userEmail} onClick={() => quickLogin(userEmail)}>
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
              <div className="user-sites">{siteCounts[userEmail] ?? 0} websites scraped</div>
              <button className="quick-login-btn" type="button" onClick={e => { e.stopPropagation(); quickLogin(userEmail); }}>
                Quick Login
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Login; 