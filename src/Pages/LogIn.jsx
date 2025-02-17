import { Visibility, VisibilityOff } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import GoogleButton from "react-google-button";
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../actions/authContext';

const LogIn = () => {
  const history = useHistory();
  const { login } = useAuth();
  const location = useLocation();
  const [serverResponse, setServerResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePassWordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:8080/auth/github";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setErrorMessage(error);
        setServerResponse('');
        setIsLoading(false);
        return;
      }

      const { success, message, user } = await response.json();

      if (success) {
        localStorage.setItem('authenticatedUser', JSON.stringify({ user }));
        login(user);

        // No admin check anymore, just redirect to the home or previous page
        const redirectTo = location.state?.from || '/'; // Redirect to previous or home page
        history.push(redirectTo);

        window.location.reload();
      } else {
        setErrorMessage(message);
        setServerResponse(message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Internal Server Error');
      setServerResponse('Internal Server Error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-6 flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your username or email"
              onChange={handleInputChange}
              aria-label="Username or Email"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
              placeholder="Enter your password"
              onChange={handleInputChange}
              aria-label="Password"
            />
            <button
              type="button"
              className="absolute top-2/3 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={handlePassWordToggle}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md ${isLoading ? 'bg-gray-500' : 'bg-blue-700'} text-white font-semibold transition-colors duration-300`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {errorMessage && (
            <div className="flex items-center text-red-600 justify-center bg-red-100 rounded-lg p-3 mt-4 text-sm">
              <MdErrorOutline className="mr-2 text-xl" />
              <span>{errorMessage}</span>
            </div>
          )}

          {serverResponse && !errorMessage && (
            <div className="flex items-center text-green-600 justify-center bg-green-100 rounded-lg p-3 mt-4 text-sm">
              <MdCheckCircle className="mr-2 text-xl" />
              <span>{serverResponse}</span>
            </div>
          )}
        </form>
        <GoogleButton
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={handleGoogleLogin}
        />
        <div className="mt-2 text-center">
          <Button
            onClick={handleGitHubLogin}
            variant="contained"
            startIcon={<GitHubIcon />}
            style={{
              backgroundColor: "#333",
              color: "white",
              marginTop: "1rem",
              width: "100%",
              textTransform: "none",
            }}
          >
            Sign in with GitHub
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 mt-6">
          <Link
            to="/ForgotPasswordAndReset"
            className="w-full text-center hover:underline text-gray-700 py-2 px-4 transition-colors duration-300"
          >
            Forgot Password
          </Link>
          <Link
            to="/signup"
            className="w-full text-center hover:underline text-gray-700 py-2 px-4 transition-colors duration-300"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
