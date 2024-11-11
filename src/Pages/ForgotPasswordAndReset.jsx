import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, CircularProgress, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from '../actions/authContext';

const ForgotPasswordAndReset = () => {
    const history = useHistory();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailSubmit = async () => {
        setIsLoading(true);

        if (!email || !email.includes("@gmail.com")) {
            setErrorMessage("Please provide a valid Gmail address.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            setIsEmailSent(true);
        } catch (error) {
            setErrorMessage("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const resetCode = otpDigits.join('');
        if (!resetCode || !newPassword || !confirmPassword) {
            setErrorMessage('All fields are required.');
            setIsLoading(false);
            return;
        }
        if (!/^\d{6}$/.test(resetCode)) {
            setErrorMessage('OTP should be a 6-digit number.');
            setIsLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/resetpassword', {
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
                throw new Error(errorMessage);
            }

            const data = await response.json();
            localStorage.setItem('authenticatedUser', JSON.stringify({ username: data.username, token: data.token }));
            setSuccessMessage('Password reset successfully.');

            if (login && typeof login === 'function') login({ username: data.username });
            history.push('/');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (/\D/.test(value)) return; // Only allow numeric input

        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        // Move focus to next input if filled
        if (value && index < otpDigits.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            if (otpDigits[index] === '' && index > 0) {
                document.getElementById(`otp-${index - 1}`).focus();
            } else {
                const newOtpDigits = [...otpDigits];
                newOtpDigits[index] = '';
                setOtpDigits(newOtpDigits);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-500 p-4">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    {isEmailSent ? "Reset Password" : "Forgot Password"}
                </h2>
                {successMessage && <p className="text-green-600 bg-green-100 p-4 rounded text-center">{successMessage}</p>}
                {errorMessage && <p className="text-red-600 bg-red-100 p-2 rounded mb-4 text-center">{errorMessage}</p>}

                {isEmailSent ? (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <p className="text-gray-700 text-center">Enter the 6-digit OTP sent to your email:</p>
                        <Box display="flex" justifyContent="center" gap={1}>
                            {otpDigits.map((digit, index) => (
                                <TextField
                                    key={index}
                                    id={`otp-${index}`}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    variant="outlined"
                                    inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                    style={{ width: '3rem' }}
                                />
                            ))}
                        </Box>

                        <div className="flex flex-col relative">
                            <label htmlFor="newPassword" className="text-sm text-gray-600">New Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
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
                                className="border border-gray-300 rounded px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
                                className="absolute right-3 top-9"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                        >
                            {isLoading ? "Resetting Password..." : "Reset My Password"}
                        </button>
                    </form>
                ) : (
                    <div>
                        <label className="block mb-2 text-gray-600 font-medium">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleEmailSubmit}
                            className={`w-full mt-6 text-white py-2 rounded-lg transition duration-300 ease-in-out ${isLoading ? "bg-green-600" : "bg-indigo-600"}`}>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }} className="text-white rounded-lg bg-green-600 transition duration-300 ease-in-out">
                                    <CircularProgress size={24} />
                                    <span className="">Sending...</span>
                                </Box>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordAndReset;
