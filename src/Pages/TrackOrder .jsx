import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TrackOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        const fetchOrdersDetails = async () => {
            try {
                const response = await fetch(`/api/trackOrder/${orderId}`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrder(data.order);
            } catch (error) {
                setError('Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrdersDetails();
    }, [orderId]);

    const cancelOrder = async () => {
        setCancelLoading(true);
        try {
            const response = await fetch(`/api/cancelOrder/${orderId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to cancel the order');
            }
            const data = await response.json();
            // Update the order status in the state
            setOrder((prevOrder) => ({
                ...prevOrder,
                order_status: 'Cancelled',
            }));
            alert(data.message || 'Order successfully cancelled.');
        } catch (error) {
            alert('Failed to cancel the order. Please try again.');
        } finally {
            setCancelLoading(false);
        }
    };

    const generateInvoice = async () => {
        try {
            const response = await fetch(`/api/generateInvoice/${orderId}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                console.error(await response.text());
                throw new Error("Failed to fetch order details");
            }

            // Handle the response as a file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('Failed to generate the invoice. Please try again.');
        }
    };


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-lg font-semibold text-gray-700">Loading order details...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-lg font-semibold text-red-500">{error}</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white text-center py-6">
                    <h1 className="text-2xl font-bold">Order Tracking</h1>
                    <p className="mt-2 text-sm">Order ID: {orderId}</p>
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                    <div className="mb-4">
                        <p className="text-gray-600">Product:</p>
                        <p className="text-lg font-medium text-gray-900">{order.product_name}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600">Status:</p>
                        <p className={`text-lg font-medium ${order.order_status === 'Delivered' ? 'text-green-600' : order.order_status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                            {order.order_status}
                        </p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600">Delivery Address:</p>
                        <p className="text-lg font-medium text-gray-900">{order.address}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600">Total Amount:</p>
                        <p className="text-lg font-medium text-gray-900">₹{order.price.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Next Steps</h3>
                    {order.order_status === 'Delivered' ? (
                        <div>
                            <p className="text-gray-600">Your order was delivered on {formatDate(order.created_at)}. Thank you for shopping with us!</p>
                            <button className='mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700'
                                onClick={generateInvoice}
                            >Generate Invoice</button>
                        </div>

                    ) : order.order_status === 'Cancelled' ? (
                        <p className="text-gray-600">Your order was cancelled.</p>
                    ) : (
                        <div>
                            <p className="text-gray-600">Your order is on its way. You can expect delivery soon!</p>
                            <button
                                className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700"
                                onClick={cancelOrder}
                                disabled={cancelLoading}
                            >
                                {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
