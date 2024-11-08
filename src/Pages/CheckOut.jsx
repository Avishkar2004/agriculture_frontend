import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const Checkout = () => {
    const location = useLocation();
    const history = useHistory();

    const cartData = location.state?.cartData || [];

    const calculateTotal = () => {
        return cartData.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleOrderSubmit = () => {
        history.push('/order-completed', { cartData });
    };

    return (
        <div className="container mx-auto my-8 max-w-4xl px-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h2>
            <p className="text-lg text-gray-600 mb-8">Review your details and place your order.</p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="flex-1">
                        <label className="text-lg text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-lg text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your email address"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="flex-1">
                        <label className="text-lg text-gray-700">Shipping Address</label>
                        <textarea
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your shipping address"
                        />
                    </div>
                </div>

                <div className="mt-8 bg-gray-50 rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-4">Order Summary</h3>
                    <ul className="space-y-4">
                        {cartData.map(item => (
                            <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                                <div>
                                    <p className="text-gray-800 font-medium">{item.name}</p>
                                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-6">
                        <p className="text-xl font-bold text-gray-800">Total:</p>
                        <p className="text-xl font-bold text-indigo-600">${calculateTotal()}</p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        type="submit"
                        onClick={handleOrderSubmit}
                        className="bg-indigo-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-indigo-600 transition-transform transform hover:scale-105"
                    >
                        Place Order
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
