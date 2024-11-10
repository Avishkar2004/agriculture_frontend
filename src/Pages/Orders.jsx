import React, { useEffect, useState } from "react";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch orders from the backend using fetch API
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/placedorders", { credentials: "include" });
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setOrders(data.orders);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-4 text-xl">Loading...</div>;
    if (error) return <div className="text-center py-4 text-xl text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-center text-lg text-gray-500">No orders found.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="px-6 py-3 text-left">Product Name</th>
                                <th className="px-6 py-3 text-left">Quantity</th>
                                <th className="px-6 py-3 text-left">Price</th>
                                <th className="px-6 py-3 text-left">Address</th>
                                <th className="px-6 py-3 text-left">Payment Method</th>
                                <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t hover:bg-gray-100">
                                    <td className="px-6 py-4">{order.product_name}</td>
                                    <td className="px-6 py-4">{order.quantity}</td>
                                    <td className="px-6 py-4">{order.product_price}</td>
                                    <td className="px-6 py-4">{order.address}</td>
                                    <td className="px-6 py-4">{order.payment_method}</td>
                                    <td className="px-6 py-4">{order.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;
