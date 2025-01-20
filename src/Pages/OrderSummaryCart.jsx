import React from "react";
import { useAuth } from "../actions/authContext"; // Assuming you have an AuthContext to get the authenticated user

const OrderSummaryCart = ({ productData, onContinue, totalPrice }) => {
    const { authenticatedUser } = useAuth();

    return (
        <div className="border p-6 rounded-lg bg-white shadow-lg mb-6 mt-6 transition-all transform">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-6">
                {/* Loop through all products */}
                {productData.map((product, index) => (
                    <div key={index} className="border-b pb-4 mb-4">
                        <div className="flex justify-between text-lg text-gray-700">
                            <span>Product:</span>
                            <span className="font-semibold text-gray-900">{product.name}</span>
                        </div>

                        <div className="flex justify-between text-lg text-gray-700">
                            <span>Price:</span>
                            <span className="font-semibold text-gray-900">₹{product.totalPrice}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Product Image:</span>
                            <img
                                src={`data:image/avif;base64,${product.image}`}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Price Section */}
            <div className="mt-6 border-t pt-4 flex justify-between text-xl font-semibold text-gray-900">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
            </div>

            {/* Email Confirmation */}
            {authenticatedUser?.email && (
                <div className="mt-4 text-gray-600 text-center">
                    <p>
                        An order confirmation email will be sent to:{" "}
                        <span className="font-semibold text-gray-800">{authenticatedUser.email}</span>
                    </p>
                </div>
            )}

            {/* Continue Button */}
            <div className="mt-6 text-center">
                <button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none"
                    onClick={onContinue} // Callback for "Continue" button
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default OrderSummaryCart;
