// src/SignUp.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import './SignUp.css';


const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 for sign up, 2 for confirmation
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                    },
                },
            });
            setStep(2); // Move to confirmation step
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await confirmSignUp({ username: email, confirmationCode });
            navigate('/login'); // Redirect to login after successful confirmation
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                {step === 1 ? (
                    <>
                        <div className="signup-header">
                            <h2>Create an Account</h2>
                            <p>Enter your details to sign up.</p>
                        </div>
                        <form onSubmit={handleSignUp}>
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
                            <button type="submit" className="signup-btn" disabled={isLoading}>
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>
                        <div className="signup-footer">
                            <p>Already have an account? <a href="/login">Log in</a></p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="signup-header">
                            <h2>Confirm Your Email</h2>
                            <p>We've sent a confirmation code to {email}.</p>
                        </div>
                        <form onSubmit={handleConfirmation}>
                            <div className="input-group">
                                <label htmlFor="confirmationCode">Confirmation Code</label>
                                <input
                                    type="text"
                                    id="confirmationCode"
                                    value={confirmationCode}
                                    onChange={(e) => setConfirmationCode(e.target.value)}
                                    placeholder="Enter your code"
                                    required
                                />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="signup-btn" disabled={isLoading}>
                                {isLoading ? 'Confirming...' : 'Confirm Sign Up'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default SignUp;

