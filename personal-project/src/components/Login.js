import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const navigate = useNavigate();

    const handleLoginOrRegister = async (e) => {
        e.preventDefault();
        console.log('Form submitted!');

        try {
            if (isNewUser) {
                if (password !== confirmPassword) {
                    alert('Passwords do not match.');
                    return;
                }
                const response = await axios.post('http://localhost:5000/api/register', {
                    username,
                    password,
                });
                alert(response.data.message);
                localStorage.setItem('loggedInUser', username);
                setIsNewUser(false);
                navigate('/log');
            } else {
                const response = await axios.post('http://localhost:5000/api/login', {
                    username,
                    password,
                });
                alert(response.data.message);
                localStorage.setItem('loggedInUser', username);
                setIsAuthenticated(true);
                navigate('/log');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred.';
            alert(errorMessage);
        }
    };

    return (
        <div className="screen">
            <div className="center">
                <header className="header">
                    <h1 className="title">Welcome to Time Tracker</h1>
                    <p className="subtitle">Please login to update your times.</p>
                </header>
            </div>
            <div className="center">
                <div className="form-container">
                    <h2 className="form-title">{isNewUser ? 'Sign Up' : 'Login'}</h2>
                    <form onSubmit={handleLoginOrRegister} className="form">
                        <input
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="input"
                        />
                        {isNewUser && (
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                                className="input"
                            />
                        )}
                        <button type="submit" className="button">
                            {isNewUser ? 'Sign Up' : 'Login'}
                        </button>
                    </form>

                    <div className="toggle">
                        <button
                            onClick={() => setIsNewUser(!isNewUser)}
                            className="toggle-button"
                        >
                            {isNewUser
                                ? 'Already have an account? Login'
                                : 'No account? Sign up'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
