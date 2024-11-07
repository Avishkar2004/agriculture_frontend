import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderCompleted = () => {
    const location = useLocation();
    const cartData = location.state?.cartData || [];

    const calculateTotal = () => {
        return cartData.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <div className="container mx-auto my-8 max-w-4xl px-6">
            <div className="bg-green-100 border-l-4 border-green-500 p-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Thank You for Your Order!</h2>
                <p className="text-lg text-gray-600 mt-2">
                    Your order has been successfully placed. We will notify you once your order is shipped.
                </p>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                <p className="text-gray-600 mb-4">Order ID: <span className="font-semibold">123456789</span></p>

                <div className="space-y-4">
                    {cartData.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                            <span className="text-gray-700">{item.name} x {item.quantity}</span>
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}

                    <div className="flex justify-between items-center border-t pt-4">
                        <span className="text-xl font-bold text-gray-800">Total</span>
                        <span className="text-xl font-bold text-gray-800">${calculateTotal()}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-lg text-gray-600 mb-4">You can track your order and view its status in your account.</p>
                <Link to="/" className="bg-indigo-500 text-white px-7 py-3 rounded-lg hover:bg-indigo-600">
                    Go to Homepage
                </Link>
            </div>

            <div className="mt-8 text-center">
                <Link to="/shop" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderCompleted;
