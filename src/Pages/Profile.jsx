import React, { useState } from 'react';
import { useAuth } from '../actions/authContext';
import Cart from './Cart';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa'; // Importing icons
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from 'react-router-dom';

const Profile = () => {
    const { authenticatedUser, logout } = useAuth();
    const [isCartEmpty, setIsCartEmpty] = useState(true);

    const handleLogout = () => {
        logout();
    };

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm("Are you sure you want to delete your account?");
        if (confirmation) {
            try {
                const response = await fetch(`/api/users/${authenticatedUser.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
                    logout();
                    window.location.reload()
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("An error occurred while deleting your account.");
            }
        }
    };

    if (!authenticatedUser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-gray-800 text-lg">
                        Please <Link to="/Signup" className="text-blue-600 hover:underline">Sign Up</Link> to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-200 to-gray-400 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-10">
                {/* Profile Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-800">
                        Welcome, {authenticatedUser.username}
                    </h2>
                    <p className="text-gray-600 text-lg mt-3">
                        {authenticatedUser.email}
                    </p>
                </div>

                {/* Shopping Cart Section */}
                <div className="mb-10">
                    <h3 className="text-3xl font-semibold text-gray-800 mb-5 flex items-center">
                        <FaUserEdit className="mr-2 text-blue-600" />
                        Shopping Cart
                    </h3>
                    <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
                        <Cart onCartStatusChange={setIsCartEmpty} /> {/* Update cart status */}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-6">
                    <button
                        className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105 hover:bg-indigo-700"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                    <button
                        className="flex items-center bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105 hover:bg-red-600"
                        onClick={handleDeleteAccount}
                    >
                        <RiDeleteBin6Line className="mr-2" /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
