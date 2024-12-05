import React, { useState } from "react";
import { useAuth } from "../actions/authContext";
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ProfileHeader = ({ username, email, avatar }) => (
    <div className="flex items-center space-x-4 mb-8">
        <div className="relative w-20 h-20">
            {avatar ? (
                <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover rounded-full shadow-lg"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full shadow-lg text-gray-600">
                    <AccountCircleIcon style={{ fontSize: "3rem" }} />
                </div>
            )}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">{username}</h2>
            <p className="text-gray-500 text-sm">{email}</p>
        </div>
    </div>
);

const ActionButtons = ({ onLogout, onDeleteAccount, isLoading }) => (
    <div className="flex space-x-4 mt-6">
        <button
            className={`flex items-center px-4 py-2 rounded-md font-semibold text-white bg-indigo-600 ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
            onClick={onLogout}
            disabled={isLoading}
        >
            <FaSignOutAlt className="mr-2" /> Logout
        </button>
        <button
            className={`flex items-center px-4 py-2 rounded-md font-semibold text-white bg-red-500 ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
                }`}
            onClick={onDeleteAccount}
            disabled={isLoading}
        >
            <RiDeleteBin6Line className="mr-2" /> Delete Account
        </button>
    </div>
);

const Profile = () => {
    const { authenticatedUser, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            logout();
        } catch (error) {
            alert("Failed to logout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (!confirmation) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/${authenticatedUser.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                logout();
                window.location.reload();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred while deleting your account.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!authenticatedUser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <p className="text-gray-700 text-lg">
                        Please{" "}
                        <Link
                            to="/Signup"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Sign Up
                        </Link>{" "}
                        to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <ProfileHeader
                    username={authenticatedUser.username}
                    email={authenticatedUser.email}
                    avatar={authenticatedUser.avatar}
                />
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Account Information
                    </h3>
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center space-x-4">
                            <FaEnvelope className="text-gray-500" />
                            <div>
                                <span className="block text-sm text-gray-600">Email Address</span>
                                <span className="text-lg font-medium text-gray-800">
                                    {authenticatedUser.email}
                                </span>
                            </div>
                        </div>
                        {/* Phone */}
                        <div className="flex items-center space-x-4">
                            <FaPhoneAlt className="text-gray-500" />
                            <div>
                                <span className="block text-sm text-gray-600">Mobile Number</span>
                                <span className="text-lg font-medium text-gray-800">
                                    {authenticatedUser.phone || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <ActionButtons
                    onLogout={handleLogout}
                    onDeleteAccount={handleDeleteAccount}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default Profile;
