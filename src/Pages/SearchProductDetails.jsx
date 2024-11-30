import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SearchProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/product/${id}`, { credentials: "include" });
        if (!response.ok) {
          throw new Error("Failed to fetch product details.");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Could not load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-4 text-lg">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-lg text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-4 text-lg">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Product Image */}
          <img
            src={`data:image/jpeg;base64,${product.image}`}
            alt={product.name}
            className="w-full md:w-1/3 rounded-lg object-contain"
          />
          {/* Product Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-lg font-semibold text-green-600 mb-4">
              Price: ₹{product.salePrice}
            </p>
            <button className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProductDetails;
