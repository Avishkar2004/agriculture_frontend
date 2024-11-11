import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../actions/authContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LogIn = () => {
  const history = useHistory();
  const { login } = useAuth();
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
      console.log("Token from Login", user.token)
      if (success) {
        localStorage.setItem('authenticatedUser', JSON.stringify({ user }));
        login(user);
        history.push('/');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-400 p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Username / Email
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
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-4">{errorMessage}</div>
          )}
          {serverResponse && (
            <div className="text-green-500 text-sm mt-4">{serverResponse}</div>
          )}
        </form>

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
