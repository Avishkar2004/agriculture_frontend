import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TrackOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState("Pending");
    const [status, setStatus] = useState("Pending"); // ✅ Add this state

    useEffect(() => {
        let interval; // Declare interval reference

        const fetchOrdersDetails = async () => {
            try {
                const response = await fetch(`/api/trackOrder/${orderId}`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }

                const data = await response.json();
                console.log("Order Data:", data.order); // ✅ Debugging

                setOrder(data.order);
                setOrderStatus(data.order.order_status);
                setStatus(data.order.status);

                // ✅ Stop polling immediately if order is Delivered or Cancelled
                if (data.order.order_status === "Delivered" || data.order.order_status === "Cancelled") {
                    return; // 🔥 Exit early, no need to fetch status
                }

                // ✅ Start polling only if order is still active
                interval = setInterval(fetchStatus, 3000);
            } catch (error) {
                setError('Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };

        const fetchStatus = async () => {
            try {
                console.log("Fetching latest status...");
                const response = await fetch(`/api/order-status/${orderId}`, { credentials: "include" });

                if (!response.ok) {
                    throw new Error(`Failed to fetch status: ${response.statusText}`);
                }

                const data = await response.json();

                if (!data || !data.status) {
                    console.error("Invalid response data:", data);
                    return;
                }

                console.log("Live Status Update:", data.status); // ✅ Debugging

                setOrderStatus((prevStatus) => (prevStatus !== data.status ? data.status : prevStatus));
                setStatus((prevStatus) => (prevStatus !== data.status ? data.status : prevStatus));

                // ✅ Stop polling if status updates to delivered or cancelled
                if (data.status === "Delivered" || data.status === "Cancelled") {
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Error fetching order status:", error.message);
            }
        };

        fetchOrdersDetails();

        return () => {
            if (interval) clearInterval(interval); // ✅ Clear interval on unmount
        };
    }, [orderId]);


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getProgress = () => {
        switch (orderStatus) {
            case "Pending": return 25;
            case "Shipped": return 50;
            case "Delivered": return 100;
            case "Cancelled": return 0;
            default: return 0;
        }
    };

    const cancelOrder = async () => {
        setCancelLoading(true);
        try {
            const response = await fetch(`/api/cancelOrder/${orderId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to cancel the order');

            const data = await response.json();
            setOrder((prevOrder) => ({ ...prevOrder, order_status: 'Cancelled' }));
            setOrderStatus('Cancelled');
            alert(data.message || 'Order successfully cancelled.');
        } catch (error) {
            alert('Failed to cancel the order. Please try again.');
        } finally {
            setCancelLoading(false);
        }
    };

    const generateInvoice = async () => {
        setInvoiceLoading(true);
        try {
            const response = await fetch(`/api/generateInvoice/${orderId}`, { method: 'GET', credentials: 'include' });
            if (!response.ok) throw new Error("Failed to fetch order details");

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
        } finally {
            setInvoiceLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-100"><p className="text-lg font-semibold text-gray-700">Loading order details...</p></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-100"><p className="text-lg font-semibold text-red-500">{error}</p></div>;


    if (!order) return <div className="text-center py-10">No order found.</div>;


    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white text-center py-6">
                    <h1 className="text-2xl font-bold">Order Tracking</h1>
                    <p className="mt-2 text-sm">Order ID: {orderId}</p>
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                    <p className="text-lg font-medium text-gray-900">{order.product_name}</p>
                    <div className="w-full bg-gray-300 h-2 rounded-full mt-4">
                        <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${getProgress()}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                        <span className={orderStatus === "Pending" ? "font-bold text-blue-600" : ""}>Pending</span>
                        <span className={orderStatus === "Shipped" ? "font-bold text-blue-600" : ""}>Shipped</span>
                        <span className={orderStatus === "Delivered" ? "font-bold text-blue-600" : ""}>Delivered</span>
                        <span className={orderStatus === "Cancelled" ? "font-bold text-red-600" : ""}>Cancelled</span>
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                    <div className="mb-4">
                        <p className="text-gray-600">Product:</p>
                        <p className="text-lg font-medium text-gray-900">{order.product_name}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600">Status:</p>
                        <p className={`text-lg font-medium ${orderStatus === 'Delivered' ? 'text-green-600' : orderStatus === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                            {orderStatus}
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

                            <button
                                className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 flex items-center justify-center"
                                onClick={generateInvoice}
                                disabled={invoiceLoading}
                            >
                                {invoiceLoading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                ) : null}
                                {invoiceLoading ? 'Generating...' : 'Generate Invoice'}
                            </button>
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
