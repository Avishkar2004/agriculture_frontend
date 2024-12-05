import React, { useState } from "react";
import { useAuth } from "../actions/authContext";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ProfileHeader = ({ username, email, avatar }) => (
    <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto mb-4">
            {avatar ? (
                <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover rounded-full shadow-lg transition-transform hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full shadow-lg text-gray-600">
                    <AccountCircleIcon style={{ fontSize: "4rem" }} />
                </div>
            )}
        </div>
        <h2 className="text-4xl font-bold text-gray-800">
            Welcome, <span className="text-indigo-600">{username}</span>
        </h2>
        <p className="text-gray-500 text-lg mt-3">{email}</p>
    </div>
);

const ActionButtons = ({ onLogout, onDeleteAccount, isLoading }) => (
    <div className="flex justify-center space-x-6 mt-6">
        <button
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-white bg-indigo-600 transition-all duration-200 transform ${
                isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 hover:bg-indigo-700"
            }`}
            onClick={onLogout}
            disabled={isLoading}
        >
            <FaSignOutAlt className="mr-2" /> Logout
        </button>
        <button
            className={`flex items-center px-6 py-3 rounded-lg font-semibold text-white bg-red-500 transition-all duration-200 transform ${
                isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 hover:bg-red-600"
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-600">
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-10">
                <ProfileHeader
                    username={authenticatedUser.username}
                    email={authenticatedUser.email}
                    avatar={authenticatedUser.avatar}
                />
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
