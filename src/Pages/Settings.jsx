import React, { useEffect, useState } from "react";
import { useAuth } from "../actions/authContext";

const Settings = () => {
    const { authenticatedUser } = useAuth() || {};
    const [user, setUser] = useState({
        name: authenticatedUser.username,
        email: authenticatedUser.email,
        phone: authenticatedUser.number || "Number Not Provided.",
    });

    const [addresses, setAddresses] = useState([]);
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotionalOffers: false,
        deliveryAlerts: true,
    });

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch("/api/deliveryAddress", {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setAddresses(data);
                } else {
                    console.error("Error fetching addresses:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        };
        fetchAddresses();
    }, []);

    const handleLogout = () => {
        alert("Logged out successfully!");
        // Add real logout logic here (e.g., clearing tokens, redirecting)
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
                    Account Settings
                </h1>

                {/* Account Settings */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Profile Information
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-lg shadow">
                        <p className="text-gray-700">
                            <span className="font-medium">Name:</span> {user.name}
                        </p>
                        <p className="text-gray-700 mt-2">
                            <span className="font-medium">Email:</span> {user.email}
                        </p>
                        <p className="text-gray-700 mt-2">
                            <span className="font-medium">Phone:</span> {user.phone}
                        </p>
                    </div>
                </div>
                {/* Saved Addresses */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Saved Addresses
                    </h2>
                    <div className="space-y-4">
                        {addresses.length > 0 ? (
                            addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <p className="text-gray-700 font-medium text-lg">
                                        {addr.name}
                                    </p>
                                    <p className="text-gray-600 mt-1">
                                        {addr.street_address}, {addr.city}, {addr.state} -{" "}
                                        {addr.pincode}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600">No addresses available.</p>
                        )}
                    </div>
                </div>

                {/* Logout */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
