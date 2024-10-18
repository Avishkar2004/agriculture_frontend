import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../actions/authContext';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordResetPage = () => {
    const { login } = useAuth();
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [username, setUsername] = useState('');
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    // Toggle the visibility of the password field
    const handlePassWordToggle = (e) => {
        e.preventDefault(); // Prevent form submission when the button is clicked
        setShowPassword(!showPassword);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        if (!resetCode || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (!(/^\d{1,6}$/).test(resetCode)) {
            setError('Invalid OTP format. It should be a numeric value of no more than 6 digits.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authenticatedUser')}`,
                },
                credentials: 'include',
                body: JSON.stringify({ otp: resetCode, newPassword }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                if (errorMessage !== 'Invalid OTP.') {
                    throw new Error(errorMessage);
                    setIsLoading(false)
                } else {
                    console.log('Ignoring "Invalid OTP" error.');
                    setError(null);
                    return;
                }
            }

            const data = await response.json();

            localStorage.setItem('authenticatedUser', JSON.stringify({
                username: data.username,
                token: data.token,
                secretKey: data.secretKey
            }));

            setSuccessMessage('Password reset successfully.');

            const usernameFromResponse = data.username;
            setUsername(usernameFromResponse);

            if (login && typeof login === 'function') {
                login({ username: data.username });
            } else {
                console.error('login is not a function or not defined');
            }

            history.push('/');
        } catch (error) {
            setError(error.message);
            setIsLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-500 p-4">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Reset Password</h2>
                {successMessage && <p className="text-green-600 bg-green-100 p-2 rounded mb-4 text-center">{successMessage}</p>}
                <form onSubmit={handleResetPassword} className="space-y-6">
                    {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-4 text-center">{error}</p>}
                    <p className="text-gray-700 text-center">We have sent an OTP reset code to your email.</p>
                    <div className="flex flex-col">
                        <label htmlFor="resetCode" className="text-sm text-gray-600">Enter OTP Code:</label>
                        <input
                            type="text"
                            id="resetCode"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-col relative">
                        <label htmlFor="newPassword" className="text-sm text-gray-600">New Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handlePassWordToggle}
                            className="absolute right-3 top-9"
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </button>
                    </div>
                    <div className="flex flex-col relative">
                        <label htmlFor="confirmPassword" className="text-sm text-gray-600">Confirm New Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handlePassWordToggle}
                            className="absolute right-3 top-9"
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                    >
                        {isLoading ? "Reseting Password...." : "Reset My Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordResetPage;
