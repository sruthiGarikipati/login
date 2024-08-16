
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyEmail.css'; // Optional: Add styling for this page

const VerifyEmail = () => {
    const navigate = useNavigate();

    return (
        <div className="verify-email-container">
            <h1>Please Check Your Email</h1>
            <p>A verification email has been sent to your email address. Please check your inbox (and spam folder) and follow the instructions to verify your email.</p>
            <button onClick={() => navigate('/login')}>Back to Login</button>
        </div>
    );
};

export default VerifyEmail;
