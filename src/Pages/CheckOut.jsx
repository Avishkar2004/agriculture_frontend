import React, { useEffect, useState } from 'react';
import { AiOutlineCreditCard, AiOutlineFileText, AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../actions/authContext';
import DeliveryAddress from './DeliveryAddress';
import LoginSection from './LoginSection';
import CartOrderConfirmModal from './CartOrderConfirmModal';
// import OrderSummary from './OrderSummary';
import PaymentOption from './PaymentOption';
import OrderSummaryCart from './OrderSummaryCart';

const Checkout = () => {
    const location = useLocation();
    const history = useHistory();
    const { authenticatedUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [expandedSection, setExpandedSection] = useState("login");
    const [isAddressSelected, setIsAddressSelected] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const cartData = location.state?.cartData || [];

    const [productData, setProductData] = useState(cartData);

    const calculateTotalPrice = () => {
        return productData.reduce((total, item) => total + item.totalPrice, 0);
    };

    const handleSubmit = async (orderData) => {
        if (!selectedAddress) {
            alert("Please select a delivery address");
            return;
        }

        const orderPayload = {
            ...orderData,
            products: productData.map(product => ({
                productName: product.name,
                productId: product.id,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
            })),
            userId: authenticatedUser?.id,
            customerName: authenticatedUser?.username,
            email: authenticatedUser?.email,
            phoneNumber: selectedAddress?.phone_number,
            address: selectedAddress?.locality,
            city: selectedAddress?.city,
            state: selectedAddress?.state,
            zipCode: selectedAddress?.pincode,
            country: "India",
        };


        try {
            const response = await fetch('/api/checkoutOrder', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            if (response.ok) {
                setTimeout(() => setShowModal(true), 1000);
            } else if (response.status === 401) {
                alert("You must be logged in to buy an item");
                history.push("/signup");
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error(error);
            alert('There was an error placing your order. Please try again.');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        history.push("/");
    };

    const goToNextSection = (section) => {
        setExpandedSection(section);
    };

    const handleToggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    useEffect(() => {
    }, [productData]);

    return (
        <div className="container mx-auto my-8">
            <div className="flex">
                <div className="w-1/2 pr-4">
                    <div className="sticky top-0 border p-4 rounded-lg mb-4 bg-white">
                        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                        {productData.map((product, index) => (
                            <div key={index} className="mb-6">
                                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                                <p className="mb-2">Price: ₹{product.totalPrice}</p>
                                <img
                                    src={`data:image/avif;base64, ${product.image}`}
                                    alt={product.name}
                                    className="mb-4 w-[17.8rem] mx-auto"
                                />
                            </div>
                        ))}
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Product Details</h3>
                            <ul className="list-disc pl-6 text-gray-600">
                                <li>Free shipping for orders above ₹500</li>
                                <li>30-day return policy</li>
                                <li>Secure payment options</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-4">
                    <div className="mb-4">
                        <button
                            className="w-full text-left bg-gray-200 p-4 rounded-lg flex justify-between items-center"
                            onClick={() => handleToggleSection('login')}
                        >
                            <div className="flex items-center">
                                <AiOutlineUser className="text-xl mr-2" />
                                <span className="font-semibold">Login Details</span>
                            </div>
                            <span className="text-xl">{expandedSection === 'login' ? '-' : '+'}</span>
                        </button>
                        {expandedSection === 'login' && <LoginSection goToNextSection={goToNextSection} />}
                    </div>
                    <div className="mb-4">
                        <button
                            className="w-full text-left bg-gray-200 p-4 rounded-lg flex justify-between items-center"
                            onClick={() => handleToggleSection('address')}
                        >
                            <div className="flex items-center">
                                <AiOutlineHome className="text-xl mr-2" />
                                <span className="font-semibold">Delivery Address</span>
                            </div>
                            <span className="text-xl">{expandedSection === 'address' ? '-' : '+'}</span>
                        </button>
                        {expandedSection === 'address' && (
                            <DeliveryAddress
                                onAddressSelect={(address) => {
                                    setSelectedAddress(address);
                                    setIsAddressSelected(true);
                                    setExpandedSection('summary');
                                }}
                            />
                        )}
                    </div>

                    <div className="mb-4">
                        <button
                            className="w-full text-left bg-gray-200 p-4 rounded-lg flex justify-between items-center"
                            onClick={() => handleToggleSection('summary')}
                        >
                            <div className="flex items-center">
                                <AiOutlineFileText className="text-xl mr-2" />
                                <span className="font-semibold">Order Summary</span>
                            </div>
                            <span className="text-xl">{expandedSection === 'summary' ? '-' : '+'}</span>
                        </button>
                        {expandedSection === 'summary' && (
                            <OrderSummaryCart
                                onContinue={() => setExpandedSection('payment')}
                                productData={productData}
                                totalPrice={calculateTotalPrice()}
                            />
                        )}
                    </div>

                    <div className="mb-4">
                        <button
                            className="w-full text-left bg-gray-200 p-4 rounded-lg flex justify-between items-center"
                            onClick={() => handleToggleSection('payment')}
                        >
                            <div className="flex items-center">
                                <AiOutlineCreditCard className="text-xl mr-2" />
                                <span className="font-semibold">Payment Options</span>
                            </div>
                            <span className="text-xl">{expandedSection === 'payment' ? '-' : '+'}</span>
                        </button>
                        {expandedSection === 'payment' && (
                            <PaymentOption onSubmit={handleSubmit} productData={productData} totalPrice={calculateTotalPrice()} />
                        )}
                    </div>
                </div>
            </div>
            {showModal && (
                <CartOrderConfirmModal
                    productData={productData}
                    totalPrice={calculateTotalPrice()}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Checkout;
