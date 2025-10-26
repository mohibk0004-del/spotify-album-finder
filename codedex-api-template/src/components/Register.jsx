import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Register = ({ onSwitchToLogin, onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            await register({
                email: formData.email,
                username: formData.username,
                password: formData.password,
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal">
            <div className="auth-modal-overlay" onClick={onClose}></div>
            <div className="auth-modal-content">
                <button className="auth-close-btn" onClick={onClose}>✕</button>

                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join to save and discover amazing albums</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                            placeholder="Choose a username"
                            minLength={3}
                            maxLength={30}
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            placeholder="Create a password"
                            minLength={6}
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="auth-switch-btn">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

