import React, { useState } from 'react';

const OrderSummary = ({ productData }) => {
  const [quantity, setQuantity] = useState(1);

  const totalPrice = productData.totalPrice * quantity;

  return (
    <div className="border p-6 rounded-lg bg-white shadow-lg mb-6 transition-all transform">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between text-lg text-gray-700">
          <span>Product:</span>
          <span className="font-semibold text-gray-900">{productData.name}</span>
        </div>

        <div className="flex justify-between text-lg text-gray-700">
          <span>Price:</span>
          <span className="font-semibold text-gray-900">₹{productData.totalPrice}</span>
        </div>

        {/* Product Image */}
        <div className="flex justify-between items-center">
          <span>Product Image:</span>
          <img
            src={`data:image/avif;base64,${productData.image}`}  // Assuming productData.image contains the image URL
            alt={productData.name}
            className="w-16 h-16 object-cover rounded-md"
          />
        </div>


        {/* Shipping */}
        <div className="flex justify-between text-lg text-gray-700">
          <span>Shipping:</span>
          <span className="font-semibold text-gray-900">Free</span>
        </div>
      </div>

      {/* Total Price Section */}
      <div className="mt-6 border-t pt-4 flex justify-between text-xl font-semibold text-gray-900">
        <span>Total:</span>
        <span>₹{totalPrice}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
