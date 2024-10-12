import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const BuyNow = () => {
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
  const location = useLocation();
  const initialProductData = (location.state && location.state.productData) || {};
  const [productData, setProductData] = useState(initialProductData);

  useEffect(() => {
    setProductData(initialProductData);
  }, [initialProductData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      name,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
      creditCard,
      quantity,
      productName: productData.name,
      totalPrice: (productData.salePrice * quantity).toFixed(2),
    });
  };

  return (
    <div className="container mx-auto my-8">
      <div className="flex">
        {/* Product Details Section */}
        <div className="w-1/2 pr-4">
          <div className="sticky top-0 border p-4 rounded-lg mb-4 bg-white">
            <h1 className="text-2xl font-bold mb-4">Checkout <span>:{productData.name}</span></h1>
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
                Credit Card:
                <input
                  type="text"
                  value={creditCard}
                  onChange={(e) => setCreditCard(e.target.value)}
                  required
                  className="border p-2 w-full rounded"
                />
              </label>

              {/* Order Summary */}
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <p className="text-lg font-semibold">Order Summary:</p>
                <p>Product: {productData.name}</p>
                <p>Quantity: {quantity}</p>
                <p>Total Price: ₹{(productData.salePrice * quantity).toFixed(2)}</p>
              </div>

              <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded w-full">
                Pay Now ₹{(productData.salePrice * quantity).toFixed(2)}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Secure Checkout</h3>
              <p className="text-gray-600">
                Your payment is securely processed with end-to-end encryption, ensuring a safe and
                smooth transaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
