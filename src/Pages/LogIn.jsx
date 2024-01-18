// src/components/Login.js
import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginWithGoogle = () => {
    // Add Google login logic here
    console.log('Login with Google');
  };

  const handleLoginWithTwitter = () => {
    // Add Twitter login logic here
    console.log('Login with Twitter');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        // Successful login
        setErrorMessage('');
        console.log('Login successful. Redirect to homepage.');
        // Redirect to homepage using React Router or window.location.href
      } else {
        // Invalid credentials
        const errorMessage = await response.text();
        setErrorMessage('Invalid username or password');
        console.error('Login failed:', errorMessage);
      }
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">
              Username / Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border-gray-300 rounded-md p-2 border"
              required
              placeholder='Enter your user name or email'
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border-gray-300 rounded-md p-2 border"
              required
              placeholder='Enter your password'
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
          >
            Login with Username and Password
          </button>
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
        </form>
        <div className='mt-3 mb-3 right-12 items-end'>
          <button className='text-blue-500 hover:underline'>Forget Pass</button>
        </div>
        <div className="text-center text-gray-600">
          <span className="mr-2">or</span>
          <button
            className="text-blue-500 hover:underline focus:outline-none"
            onClick={handleLoginWithGoogle}
          >
            Continue with Google
          </button>
          <span className="mx-2">/</span>
          <button
            className="text-blue-500 hover:underline focus:outline-none"
            onClick={handleLoginWithTwitter}
          >
            Continue with Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
