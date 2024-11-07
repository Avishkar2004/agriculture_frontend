import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const Checkout = () => {
    const location = useLocation()
    const history = useHistory();

    const cartData = location.state?.cartData || []

    const calculateTotal = () => {
        return cartData.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
    }
    // Simulate an order submission process
    const handleOrderSubmit = () => {
        alert("Order submitted successfully!");
        history.push('/order-completed', { cartData }); // Navigate to order confirmation page
    };

    return (
        <div className="container mx-auto my-8 max-w-4xl px-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h2>
            <p className="text-lg text-gray-600 mb-8">Review your details and place your order.</p>

            {/* Checkout Form (for now a simple simulation) */}
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

                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800">Order Summary:</h3>
                    <ul className="space-y-4 mt-4">
                        {cartData.map(item => (
                            <li key={item.id} className="flex justify-between items-center">
                                <span className="text-gray-700">{item.name} x {item.quantity}(Quantity)</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-xl font-bold text-gray-800">Total: ${calculateTotal()}</p>
                        <button
                            type="submit"
                            onClick={handleOrderSubmit}
                            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600"
                        >
                            Place Order
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Checkout;
