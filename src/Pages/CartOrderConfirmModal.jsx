const CartOrderConfirmModal = ({ productData, onClose, totalPrice }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-md">
            {/* Success Header */}
            <h2 className="text-3xl font-bold mb-4 text-green-600">Order Placed Successfully!</h2>

            {/* Product Names List */}
            <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-700 mb-4">Ordered Products:</h3>
                <ul className="space-y-2">
                    {productData.map((product, index) => (
                        <li
                            key={index}
                            className="p-3 bg-gray-100 rounded-md shadow-sm text-gray-800 text-lg font-semibold"
                        >
                            {product.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Total Price */}
            <p className="text-lg font-medium text-gray-600">
                <span className="font-bold text-gray-800">Total Price:</span> ₹{totalPrice.toFixed(2)}
            </p>

            {/* Close Button */}
            <button
                className="mt-6 bg-blue-500 text-white px-5 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition focus:outline-none"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    </div>
);

export default CartOrderConfirmModal;
