import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaSignOutAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAuth } from "../actions/authContext";

const maskEmail = (email) => {
  const [localPart, domain] = email.split("@");
  const parts = localPart.split(".");
  const visiblePart = parts.length > 1 ? parts.slice(-2).join(".") : localPart.slice(-2)
  const maskedPart = "*".repeat(localPart.length - visiblePart.length)
  return `${maskedPart}${visiblePart}@${domain}`;
};

const ProfileHeader = ({ username, email, avatar }) => (
  <div className="flex items-center space-x-6 mb-8">
    <div className="relative w-24 h-24">
      {avatar ? (
        <img
          src={avatar}
          alt="Profile Avatar"
          className="w-full h-full object-cover rounded-full shadow-lg border-2 border-indigo-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full shadow-lg text-gray-600">
          <AccountCircleIcon style={{ fontSize: "3.5rem" }} />
        </div>
      )}
    </div>
    <div>
      <h2 className="text-3xl font-extrabold text-gray-800">{username}</h2>
      <p className="text-indigo-600 text-sm font-semibold">{maskEmail(email)}</p>
    </div>
  </div>
);

const ActionButtons = ({ onLogout, onDeleteAccount, isLoading }) => (
  <div className="flex space-x-4 mt-8">
    <button
      className={`flex items-center px-5 py-3 rounded-lg font-semibold text-white bg-indigo-600 shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 hover:shadow-lg"
        }`}
      onClick={() => {
        if (window.confirm("Are you sure you want to logout?")) {
          onLogout()
        }
      }}
      disabled={isLoading}
    >
      <FaSignOutAlt className="mr-2" /> Logout
    </button>
    <button
      className={`flex items-center px-5 py-3 rounded-lg font-semibold text-white bg-red-500 shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600 hover:shadow-lg"
        }`}
      onClick={() => {
        if (window.confirm("Are you sure you want to delete your account ?")) {
          onDeleteAccount()
        }
      }}
      disabled={isLoading}
    >
      <RiDeleteBin6Line className="mr-2" /> Delete Account
    </button>
  </div>
);

const Profile = () => {
  const { authenticatedUser, logout } = useAuth() || {};
  const [isLoading, setIsLoading] = useState(false);


  const ProfilehandleLogOut = async () => {
    try {
      const response = await fetch("/logout", { method: "POST", credentials: "include" })
      if (response.ok) {
        logout()
        window.location.reload()
      }
    } catch (error) {
      console.error("Error logging out", error)
    }
  }


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
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-gray-700 text-lg">
            Please{" "}
            <Link
              to="/Signup"
              className="text-indigo-600 font-semibold hover:underline"
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
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <ProfileHeader
          username={authenticatedUser.username}
          email={authenticatedUser.email}
          avatar={authenticatedUser.avatar}
        />
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Account Information
          </h3>
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <FaEnvelope className="text-indigo-600" />
              </div>
              <div>
                <span className="block text-sm text-gray-600">Email Address</span>
                <span className="text-lg font-semibold text-gray-800">
                  {maskEmail(authenticatedUser.email)}
                </span>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FaPhoneAlt className="text-green-600" />
              </div>
              <div>
                <span className="block text-sm text-gray-600">Mobile Number</span>
                <span className="text-lg font-semibold text-gray-800">
                  {authenticatedUser.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <ActionButtons
          onLogout={ProfilehandleLogOut}
          onDeleteAccount={handleDeleteAccount}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Profile;
