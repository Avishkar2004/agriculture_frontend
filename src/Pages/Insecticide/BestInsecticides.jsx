import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BannerInsecticide from "../../Components/Banner/Insecticide.jpg";
import Recentlyviewed from "../Recentlyviewed";
import ShimmerCard from "../ShimmerCard";

const BestInsecticides = () => {
  const [insecticideData, setInsecticideData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("insecticideData")
        if (cachedData) {
          setInsecticideData(JSON.parse(cachedData))
          setLoading(false)
        } else {

          const response = await fetch("/insecticide");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          localStorage.setItem("insecticideData", JSON.stringify(data))
          setInsecticideData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <p>Error : {error}</p>;
  }
  return (
    <div className="mx-6 px-4 sm:px-6 lg:px-8 mt-3">
      {/* Breadcrumb */}
      <div className="flex flex-wrap text-sm md:text-base gap-3 md:gap-6 text-gray-500 font-secondary">
        <span className="flex flex-wrap gap-2">
          <Link to="/" className="hover:text-blue-500">
            Home
          </Link>
          &gt;
          <span>Buy Insecticide Online &gt;</span>
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <div className="w-full bg-white p-4 border border-gray-200 rounded-lg">
          {/* Banner Image */}
          <div className="flex justify-center pl-5 w-full h-[55%]">
            <img
              src={BannerInsecticide}
              alt=""
              className="w-full max-h-[300px] rounded-lg"
            />
          </div>

          {/* Title */}
          <div className="text-center mt-5 font-primary text-2xl sm:text-3xl text-blue-500">
            <h1>Buy Insecticide Online</h1>
          </div>

          {/* Description */}
          <div className="mt-4 space-y-5 font-secondary text-sm sm:text-base">
            <p>
              Insecticide is the most useful thing for agriculture so farmers can use it for controlling fungi.
            </p>
          </div>

          <hr className="mt-5 border border-gray-200" />

          {/* Responsive Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 font-secondary text-sm sm:text-base">
            <p className="text-center sm:text-left mb-4 sm:mb-0">
              Showing 1 - {insecticideData.length} of {insecticideData.length} products
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              {/* Display Dropdown */}
              <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-0">
                <label>
                  Display:
                  <select
                    name="Display"
                    className="ml-2 p-1 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="24 per page">24 per page</option>
                    <option value="36 per page">36 per page</option>
                    <option value="48 per page">48 per page</option>
                  </select>
                </label>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center justify-center sm:justify-start">
                <label>
                  Sort By:
                  <select
                    name="Sort By"
                    className="ml-2 p-1 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="best-selling">Best Selling</option>
                    <option value="top-rated">Top Rated</option>
                    <option value="most-reviewed">Most Reviewed</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <hr className="mt-5 border border-gray-200" />

          {/* Product Grid */}
          {loading ? (
            <div>
              <ShimmerCard count={3} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
              {insecticideData.map((product) => (
                <Link
                  to={{
                    pathname: `/insecticide/${encodeURIComponent(product.id)}`,
                    state: { productData: product },
                  }}
                  key={product.id}
                  className="border border-gray-200 rounded-lg overflow-hidden transition-shadow"
                >
                  <div className="image-container">
                    <img
                      src={`data:image/avif;base64, ${product.image}`}
                      alt={product.altTag || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold font-primary">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-600 font-secondary font-semibold">
                      {product.description}
                    </p>
                    <p className="text-red-500 font-secondary">{product.salePrice}</p>
                    <p className="text-green-600 font-secondary font-medium">
                      {product.reviews}
                    </p>
                    <p className="text-gray-600 font-secondary">
                      {product.stockStatus}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed */}
      <Recentlyviewed />
    </div>
  );
};

export default BestInsecticides;
