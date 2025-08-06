// src/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';
import './Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { isSignedIn } = await signIn({ username: email, password });
            
            if (isSignedIn) {
                const [attributes, session] = await Promise.all([
                    fetchUserAttributes(),
                    fetchAuthSession()
                ]);

                const groups = session.tokens?.accessToken.payload["cognito:groups"] as string[] | undefined;

                localStorage.setItem('currentUser', JSON.stringify({
                    name: attributes.name || attributes.email,
                    role: groups?.[0] || 'user',
                    email: attributes.email,
                }));
    
                navigate('/');
            } else {
                setError('Sign in was not successful. Please check your credentials.');
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2>Welcome to Strata</h2>
                    <p>Please enter your credentials to log in.</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="login-footer">
                    <p>Don't have an account? <a href="/signup">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
