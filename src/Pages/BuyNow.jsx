import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import OrderConfirmModal from './OrderConfirmModal';
import { useAuth } from "../actions/authContext";
import LoginSection from './LoginSection';
import DeliveryAddress from './DeliveryAddress';
import OrderSummary from './OrderSummary';
import PaymentOption from './PaymentOption';
import { AiOutlineUser, AiOutlineHome, AiOutlineFileText, AiOutlineCreditCard } from 'react-icons/ai';

const BuyNow = () => {
  const history = useHistory();
  const { authenticatedUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState("login"); // Track the expanded section
  const location = useLocation();
  const initialProductData = (location.state && location.state.productData) || {};
  const [productData, setProductData] = useState(initialProductData);

  const handleSubmit = async (orderData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
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
    history.push('/');
  };

  const handleToggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    setProductData(initialProductData);
  }, [initialProductData]);

  return (
    <div className="container mx-auto my-8">
      <div className="flex">
        {/* Product Details Section */}
        <div className="w-1/2 pr-4">
          <div className="sticky top-0 border p-4 rounded-lg mb-4 bg-white">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <h2 className="text-2xl font-bold mb-2">{productData.name}</h2>
            <p className="mb-4">Price: ₹{productData.totalPrice}</p>
            <img
              src={`data:image/avif;base64, ${productData.image}`}
              alt={productData.name}
              className="mb-4 w-[17.8rem] mr-auto ml-auto"
            />
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

        {/* Accordion Checkout Form Section */}
        <div className="w-full md:w-1/2 p-4">
          {/* Login Section */}
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
            {expandedSection === 'login' && <LoginSection />}
          </div>

          {/* Delivery Address */}
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
            {expandedSection === 'address' && <DeliveryAddress />}
          </div>

          {/* Order Summary */}
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
            {expandedSection === 'summary' && <OrderSummary productData={productData} />}
          </div>

          {/* Payment Option */}
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
            {expandedSection === 'payment' && <PaymentOption onSubmit={handleSubmit} productData={productData} />}
          </div>
        </div>
      </div>

      {/* Modal for Order Confirmation */}
      {showModal && (
        <OrderConfirmModal
          productData={productData}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default BuyNow;
