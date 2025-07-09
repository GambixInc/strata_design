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

const userSiteMap: Record<string, string[]> = {
  'john@techstartup.com': [
    'techstartup.com',
    'product-demo.com',
    'landing-page.com',
    'blog.techstartup.com',
    'support.techstartup.com',
  ],
  'sarah@ecommerce.com': [
    'ecommerce-pro.com',
    'shop.ecommerce-pro.com',
    'blog.ecommerce-pro.com',
    'help.ecommerce-pro.com',
    'about.ecommerce-pro.com',
    'contact.ecommerce-pro.com',
    'products.ecommerce-pro.com',
    'categories.ecommerce-pro.com',
    'deals.ecommerce-pro.com',
    'reviews.ecommerce-pro.com',
    'faq.ecommerce-pro.com',
    'shipping.ecommerce-pro.com',
  ],
  'mike@agency.com': Array.from({ length: 25 }, (_, i) => `client${i + 1}.com`),
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [siteCounts, setSiteCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the real list of scraped sites from the backend
    fetch('/api/sites')
      .then(res => res.json())
      .then(data => {
        const allSites: string[] = data.sites || [];
        // Assign sites to users based on the original mapping
        const counts: Record<string, number> = {};
        Object.keys(userSiteMap).forEach(userEmail => {
          // Count how many of the user's mapped sites are in the backend list
          counts[userEmail] = userSiteMap[userEmail].filter(site => allSites.includes(site)).length;
        });
        // For Mike, if there are more sites than mapped, assign the rest to him
        const mikeSites = userSiteMap['mike@agency.com'];
        const assignedSites = Object.values(userSiteMap).flat();
        const unassigned = allSites.filter(site => !assignedSites.includes(site));
        counts['mike@agency.com'] += unassigned.length;
        setSiteCounts(counts);
      })
      .catch(() => {
        // fallback: use the original mapping
        setSiteCounts({
          'john@techstartup.com': userSiteMap['john@techstartup.com'].length,
          'sarah@ecommerce.com': userSiteMap['sarah@ecommerce.com'].length,
          'mike@agency.com': userSiteMap['mike@agency.com'].length,
        });
      });
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
          sites: userSiteMap[email],
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
        {Object.entries(mockUsers).map(([userEmail, user]) => (
          <div className="user-card" key={userEmail} onClick={() => quickLogin(userEmail)}>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
            <div className="user-sites">{siteCounts[userEmail] ?? 0} websites scraped</div>
            <button className="quick-login-btn" type="button" onClick={e => { e.stopPropagation(); quickLogin(userEmail); }}>
              Quick Login
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login; 