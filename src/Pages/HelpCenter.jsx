import React from "react";

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6">
                    Help Center
                </h1>
                <p className="text-center text-gray-600 mb-10">
                    Find answers to your questions or get in touch with our support team.
                </p>
                {/* FAQ Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Frequently Asked Questions (FAQs)
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-800">
                                How do I track my order?
                            </h3>
                            <p className="text-gray-600 mt-2">
                                You can track your order by visiting the "Order Tracking" section in your account or using the tracking link sent to your email.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-800">
                                What is the return policy?
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Returns are accepted within 30 days of delivery. Items must be in their original condition. Visit the "Returns & Refunds" page for more details.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-800">
                                How do I contact customer support?
                            </h3>
                            <p className="text-gray-600 mt-2">
                                You can reach our support team via email at support@yourstore.com or call us at +1 (123) 456-7890.
                            </p>
                        </div>
                    </div>
                </div>
                {/* General Topics Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Explore More Topics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            "Payments & Billing",
                            "Shipping Information",
                            "Returns & Refunds",
                            "Account Management",
                            "Privacy Policy",
                            "Terms & Conditions",
                        ].map((topic, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition"
                            >
                                <p className="text-gray-700 font-medium">{topic}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
