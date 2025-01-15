import React from 'react';
import { FaBell, FaSignOutAlt, FaStar, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from "../actions/authContext";

const LoginSection = ({ goToNextSection }) => {
    const { authenticatedUser, logout } = useAuth();

    return (
        <div className="border rounded-lg bg-white shadow-lg p-5 mb-8">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h2 className="text-lg font-semibold flex items-center">
                    <span className="mr-2">1</span>
                    LOGIN
                </h2>
            </div>
            {authenticatedUser ? (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-gray-700 font-medium text-lg">Name: <span className="text-gray-900">{authenticatedUser.username || authenticatedUser.email}</span></p>
                            <p className="text-gray-700 font-medium">Phone: <span className="text-gray-900">+919322810348</span></p>
                        </div>
                        <button onClick={logout} className="text-blue-600 hover:underline flex items-center">
                            <FaSignOutAlt className="mr-2" />
                            Logout & Sign in to another account
                        </button>
                    </div>
                    <button onClick={() => goToNextSection("address")} className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none">
                        CONTINUE CHECKOUT
                    </button>

                    <div className="mt-6 text-gray-500">
                        <h3 className="text-gray-700 font-semibold mb-3">Advantages of our secure login</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <FaTruck className="text-blue-600 mr-3" />
                                Easily Track Orders, Hassle free Returns
                            </li>
                            <li className="flex items-center">
                                <FaBell className="text-blue-600 mr-3" />
                                Get Relevant Alerts and Recommendations
                            </li>
                            <li className="flex items-center">
                                <FaStar className="text-blue-600 mr-3" />
                                Wishlist, Reviews, Ratings and more.
                            </li>
                        </ul>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">
                        Please note that upon clicking "Logout" you will lose all items in cart and will be redirected to the homepage.
                    </p>
                </div>
            ) : (
                <div className="p-6 text-center text-gray-600">
                    <p className="text-lg mb-6 font-medium">Please log in to continue and enjoy personalized services.</p>
                    <Link to="/signin" className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none">
                        Log In
                    </Link>
                </div>
            )}
        </div>
    );
};

export default LoginSection;
