import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderCompleted = () => {
    const location = useLocation();
    const [orderId, setOrderId] = useState('');
    const [orderStatus, setOrderStatus] = useState(null); // State for tracking order status
    const [loading, setLoading] = useState(true); // For loading state

    const cartData = location.state?.cartData || [];

    const calculateTotal = () => {
        return cartData.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const generateOrderId = (length = 10) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let orderId = 'ORD-';
        for (let i = 0; i < length; i++) {
            orderId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return orderId;
    };

    // Function to fetch order status
    const fetchOrderStatus = async (orderId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/orders/${orderId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order status');
            }
            const data = await response.json();
            setOrderStatus(data.status); // Assuming the response contains a 'status' field
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setOrderId(generateOrderId());
    }, []);

    useEffect(() => {
        if (orderId) {
            fetchOrderStatus(orderId);
        }
    }, [orderId]);

    return (
        <div className="container mx-auto my-8 max-w-4xl px-6">
            <div className="bg-green-100 border-l-4 border-green-500 p-6 mb-8 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold text-gray-800">Thank You for Your Order!</h2>
                <p className="text-lg text-gray-600 mt-2">
                    Your order has been successfully placed. We will notify you once it has shipped.
                </p>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Order ID:</span> <span className="text-indigo-500">{orderId}</span>
                </p>

                <div className="space-y-4">
                    {cartData.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm">
                            <div>
                                <p className="text-gray-800 font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <div className="flex justify-between items-center border-t pt-4 mt-4">
                        <span className="text-xl font-bold text-gray-800">Total</span>
                        <span className="text-xl font-bold text-indigo-600">${calculateTotal()}</span>
                    </div>
                </div>
            </div>

            {/* Order Status Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Track Your Order</h3>
                {loading ? (
                    <p className="text-gray-600">Loading order status...</p>
                ) : orderStatus ? (
                    <p className="text-lg text-gray-600">
                        <span className="font-semibold">Order Status:</span> {orderStatus}
                    </p>
                ) : (
                    <p className="text-lg text-gray-600">Unable to retrieve order status.</p>
                )}
            </div>

            <div className="mt-8 text-center space-y-4">
                <p className="text-lg text-gray-600 mb-4">You can track your order and view its status in your account.</p>
                <Link to="#" className="bg-indigo-500 text-white px-7 py-3 rounded-lg hover:bg-indigo-600 shadow-md">
                    Go to Homepage
                </Link>
                <Link to="#" className="bg-blue-500 text-white px-7 py-3 rounded-lg hover:bg-blue-600 shadow-md ml-4">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderCompleted;
