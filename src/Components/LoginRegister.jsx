import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import './LoginRegister.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAttempted, setPasswordAttempted] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegisterLink = () => {
    setIsRegister(true);
    resetPasswordCriteria();
    setErrorMessage('');
  };

  const handleLoginLink = () => {
    setIsRegister(false);
    resetPasswordCriteria();
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordAttempted(true);
    validatePassword(newPassword);
  };

  const resetPasswordCriteria = () => {
    setPassword('');
    setPasswordAttempted(false);
    setPasswordCriteria({
      length: false,
      uppercase: false,
      lowercase: false,
      digit: false,
      specialChar: false
    });
  };

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password)
    };
    setPasswordCriteria(criteria);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegister) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await user.sendEmailVerification();
        navigate('/verify-email'); // Redirect to email verification page
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('This email is already in use. Please log in or use a different email address.');
        } else {
          setErrorMessage(error.message);
        }
        console.error('Registration error:', error.message);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
          const userDocRef = doc(db, 'login', user.uid);

          // Check if document exists
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            // Update the document if it exists
            await updateDoc(userDocRef, {
              password: password
            });
          } else {
            // Create the document if it does not exist
            await setDoc(userDocRef, {
              email: email,
              name: username,
              password: password
            });
          }

          navigate('/welcome');
        } else {
          setErrorMessage('Please verify your email address.');
        }
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect password. Please try again.');
        } else if (error.code === 'auth/user-not-found') {
          setErrorMessage('No account found with this email. Please register.');
        } else {
          setErrorMessage(error.message);
        }
        console.error('Login error:', error.message);
      }
    }
  };

  return (
    <div className={`wrapper ${isRegister ? 'active' : ''}`}>
      <div className={`form-box login ${isRegister ? 'hide' : ''}`}>
        <form onSubmit={handleSubmit}>
          <h1 className="white-text">Login</h1>
          {errorMessage && <p className="message error white-text">{errorMessage}</p>}
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" role="button" tabIndex="0" className="white-text" onClick={() => navigate('/forgot-password')}>Forgot Password</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p className="white-text">Don't have an account? <button type="button" className="white-text" onClick={handleRegisterLink}>Sign Up</button></p>
          </div>
        </form>
      </div>

      <div className={`form-box register ${isRegister ? '' : 'hide'}`}>
        <form onSubmit={handleSubmit}>
          <h1 className="white-text">Sign Up</h1>
          {errorMessage && <p className="message error white-text">{errorMessage}</p>}
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <FaLock className="icon" />
          </div>
          {passwordAttempted && (
            <div className="password-instructions">
              <p className={passwordCriteria.length ? 'valid white-text' : 'invalid white-text'}>At least 8 characters long</p>
              <p className={passwordCriteria.uppercase ? 'valid white-text' : 'invalid white-text'}>At least one uppercase letter</p>
              <p className={passwordCriteria.lowercase ? 'valid white-text' : 'invalid white-text'}>At least one lowercase letter</p>
              <p className={passwordCriteria.digit ? 'valid white-text' : 'invalid white-text'}>At least one digit</p>
              <p className={passwordCriteria.specialChar ? 'valid white-text' : 'invalid white-text'}>At least one special character (!@#$%^&*)</p>
            </div>
          )}
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> I agree to the terms & conditions
            </label>
          </div>
          <button type="submit" disabled={!Object.values(passwordCriteria).every(Boolean)}>Sign Up</button>
          <div className="register-link">
            <p className="white-text">Already have an account? <button type="button" className="white-text" onClick={handleLoginLink}>Login</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;


















