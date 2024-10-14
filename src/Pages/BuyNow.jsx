import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import OrderConfirmModal from './OrderConfirmModal';
// Order confirmation modal component

const BuyNow = () => {
  const history = useHistory()
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard'); // default option is credit card
  const [bankName, setBankName] = useState('');
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const location = useLocation();
  const initialProductData = (location.state && location.state.productData) || {};
  const [productData, setProductData] = useState(initialProductData);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  useEffect(() => {
    setProductData(initialProductData);
  }, [initialProductData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show the modal after clicking "Pay Now"

    setTimeout(() => {
      setShowModal(true);

    }, 1000);

  };

  const closeModal = () => {
    setShowModal(false);
    history.push('/')
  };

  return (
    <div className="container mx-auto my-8">
      <div className="flex">
        {/* Product Details Section */}
        <div className="w-1/2 pr-4">
          <div className="sticky top-0 border p-4 rounded-lg mb-4 bg-white">
            <h1 className="text-2xl font-bold mb-4">
              Checkout <span>:{productData.name}</span>
            </h1>
            <h2 className="text-2xl font-bold mb-2">{productData.name}</h2>
            <p className="mb-2">Product Name: {productData.name}</p>
            <p className="mb-4">Price: ₹{productData.salePrice}</p>
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

        {/* Checkout Form Section */}
        <div className="w-full md:w-1/2 p-4">
          <div className="border p-4 rounded-lg bg-white shadow">
            <h2 className="text-2xl font-bold mb-4">Order Information</h2>
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              <label className="block mb-2">
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              <label className="block mb-2">
                Phone Number:
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              {/* Shipping Information */}
              <h3 className="text-xl font-semibold mt-4 mb-2">Shipping Address</h3>

              <label className="block mb-2">
                Address:
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              <label className="block mb-2">
                City:
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              <label className="block mb-2">
                State/Province:
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              <label className="block mb-2">
                Zip/Postal Code:
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              <label className="block mb-2">
                Country:
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              {/* Payment Information */}
              <h3 className="text-xl font-semibold mt-4 mb-2">Payment Details</h3>

              <label className="block mb-2">
                Payment Method:
                <select
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="creditCard">Credit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netBanking">Net Banking</option>
                  <option value="paypal">PayPal</option>
                </select>
              </label>

              {paymentMethod === 'creditCard' && (
                <label className="block mb-2">
                  Credit Card:
                  <input
                    type="text"
                    value={creditCard}
                    onChange={(e) => setCreditCard(e.target.value)}
                    required
                    className="border p-2 w-full rounded"
                  />
                </label>
              )}

              {paymentMethod === 'upi' && (
                <label className="block mb-2">
                  UPI ID:
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className="border p-2 w-full rounded"
                  />
                </label>
              )}

              {paymentMethod === 'netBanking' && (
                <label className="block mb-2">
                  Bank Name:
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    className="border p-2 w-full rounded"
                  />
                </label>
              )}

              {paymentMethod === 'paypal' && (
                <div className="block mb-2">
                  <p>Redirecting to PayPal for secure checkout...</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for Order Confirmation */}
      {showModal && (
        <OrderConfirmModal
          productData={productData}
          quantity={quantity}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default BuyNow;
