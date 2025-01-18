import React from 'react';
import { useLocation } from 'react-router-dom';

const ProductDetails = () => {
    const location = useLocation();
    const { product } = location.state || {};

    if (!product) return (
        <div className="container mx-auto p-8 text-center">
            <p className="text-xl font-semibold text-red-500">Product information not available.</p>
        </div>
    );
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
            <div className="container mx-auto p-8 max-w-3xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2">
                            <img
                                src={`data:image/avif;base64,${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-t-none transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        <div className="p-8 md:w-1/2 flex flex-col justify-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                            <p className="text-xl text-gray-700 mb-2">
                                <span className="font-semibold">Price:</span> ₹{product.price}
                            </p>
                            <p className="text-md text-gray-500 mb-4">
                                <span className="font-semibold">Description:</span> {product.description || "No description available."}
                            </p>
                            <p className="text-md text-gray-500 mb-4">
                                <span className="font-semibold">Quantity:</span> {product.quantity}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
