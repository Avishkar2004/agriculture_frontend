import React, { useState } from 'react';

const PaymentOption = ({ onSubmit, productData }) => {
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [paymentDetails, setPaymentDetails] = useState({
        creditCard: '',
        upiId: '',
        bankName: '',
        paypalEmail: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
        setError('');
    };

    const handleDetailChange = (e) => {
        setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        if (paymentMethod === 'creditCard' && !paymentDetails.creditCard) {
            setError('Please enter your credit card details.');
            setLoading(false);
            return;
        }
        if (paymentMethod === 'upi' && !paymentDetails.upiId) {
            setError('Please enter your UPI ID.');
            setLoading(false);
            return;
        }
        if (paymentMethod === 'netBanking' && !paymentDetails.bankName) {
            setError('Please enter your bank name.');
            setLoading(false);
            return;
        }
        if (paymentMethod === 'paypal' && !paymentDetails.paypalEmail) {
            setError('Please enter your PayPal email.');
            setLoading(false);
            return;
        }
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSubmit({ ...productData, paymentMethod, paymentDetails });
            // alert('Payment successful!');
        }, 2000);
    };

    return (
        <div className="border p-6 rounded-lg bg-white shadow-lg mb-6 transition-all transform">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Options</h2>

            {/* Payment Method Selector */}
            <div className="mb-4">
                <label className="text-gray-700 font-semibold">Choose Payment Method:</label>
                <select
                    value={paymentMethod}
                    onChange={handlePaymentChange}
                    className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                >
                    <option value="creditCard">Credit Card</option>
                    <option value="upi">UPI</option>
                    <option value="netBanking">Net Banking</option>
                    <option value="paypal">PayPal</option>
                </select>
            </div>

            {/* Conditional Fields for Payment Details */}
            {paymentMethod === 'creditCard' && (
                <div className="mb-4">
                    <label className="text-gray-700 font-semibold">Credit Card Number:</label>
                    <input
                        type="text"
                        name="creditCard"
                        value={paymentDetails.creditCard}
                        onChange={handleDetailChange}
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        placeholder="Enter your credit card number"
                        maxLength={19} // Formatting card number
                    />
                </div>
            )}

            {paymentMethod === 'upi' && (
                <div className="mb-4">
                    <label className="text-gray-700 font-semibold">UPI ID:</label>
                    <input
                        type="text"
                        name="upiId"
                        value={paymentDetails.upiId}
                        onChange={handleDetailChange}
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        placeholder="Enter your UPI ID"
                    />
                </div>
            )}

            {paymentMethod === 'netBanking' && (
                <div className="mb-4">
                    <label className="text-gray-700 font-semibold">Bank Name:</label>
                    <input
                        type="text"
                        name="bankName"
                        value={paymentDetails.bankName}
                        onChange={handleDetailChange}
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        placeholder="Enter your bank name"
                    />
                </div>
            )}

            {paymentMethod === 'paypal' && (
                <div className="mb-4">
                    <label className="text-gray-700 font-semibold">PayPal Email:</label>
                    <input
                        type="email"
                        name="paypalEmail"
                        value={paymentDetails.paypalEmail}
                        onChange={handleDetailChange}
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        placeholder="Enter your PayPal email"
                    />
                </div>
            )}

            {/* Display Error Message */}
            {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            {/* Submit Button */}
            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center "
                    disabled={loading}
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        'Pay Now'
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentOption;
