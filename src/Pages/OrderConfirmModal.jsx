const OrderConfirmModal = ({ productData, onClose, totalPrice }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Order Successful!</h2>
      <p className="mb-2">Product: {productData.name}</p>
      {/* <p className="mb-2">Quantity: {quantity}</p> */}
      <p className="mb-2">Total Price: ₹{totalPrice.toFixed(2)}</p>
      <img
        src={`data:image/avif;base64, ${productData.image}`}
        alt={productData.name}
        className="mb-4 w-[17.8rem] mr-auto ml-auto"
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

export default OrderConfirmModal