import React, { useState } from 'react';
import { useAuth } from '../actions/authContext';
import Cart from './Cart';
import { FaUserEdit, FaSave, FaSignOutAlt } from 'react-icons/fa'; // Importing icons

const Profile = () => {
    const { authenticatedUser, logout } = useAuth();
    const [editMode, setEditMode] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const handleEdit = () => {
        setEditMode(!editMode);
    };

    // Check if the user is logged in
    if (!authenticatedUser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-gray-800 text-lg">
                        Please log in to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-200 to-gray-400 flex items-center justify-center">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl p-10">
                {/* Profile Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-5xl font-extrabold text-gray-800">
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
                        <Cart />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-6">
                    <button
                        className="flex items-center bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
