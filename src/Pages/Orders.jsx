import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/placedorders", { credentials: "include" });
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setOrders(data.orders);
                setError(null);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const trackOrder = async (orderId) => {
        history.push(`/track-order/${orderId}`)
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                    <p className="text-xl font-semibold text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-lg text-red-500 mb-4">{error}</p>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
                        onClick={() => window.location.href = "/"}
                    >
                        Order Now
                    </button>
                </div>
            </div>
        );

    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center flex flex-col items-center">
                        <p className="text-lg text-gray-500">You haven’t placed any orders yet.</p>
                        <button
                            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
                            onClick={() => window.location.href = "/#"}
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.product_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₹{order.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {order.payment_method}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.order_status === "delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <button
                                                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-blue-600"
                                                onClick={() => trackOrder(order.id)}
                                            >
                                                Track Order
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;