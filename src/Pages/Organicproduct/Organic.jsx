import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrganicProduct from "../../Components/Banner/orgnicProduct.jpg";
import Recentlyviewed from "../Recentlyviewed";
import ShimmerCard from "../ShimmerCard";

const Organic = () => {
  const [OrganicproductData, setOrganicproductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("OrganicproductData")
        if (cachedData) {
          setOrganicproductData(JSON.parse(cachedData))
          setLoading(false)
        } else {
          const response = await fetch("/organicproduct");
          if (!response.ok) {
            throw new Error("Failed to fetch organicproduct data");
          }
          const data = await response.json();
          localStorage.setItem("OrganicproductData", JSON.stringify(data))
          setOrganicproductData(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
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
          <span>Buy Organic Product Online &gt;</span>
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <div className="w-full bg-white p-4 border border-gray-200 rounded-lg">
          {/* Banner Image */}
          <div className="flex justify-center pl-5 w-full">
            <img
              src={OrganicProduct}
              alt=""
              className="w-full max-h-[300px] rounded-lg"
            />
          </div>

          {/* Title */}
          <div className="text-center mt-5 font-primary text-2xl sm:text-3xl text-blue-500">
            <h1>Buy Organic Product Online</h1>
          </div>

          {/* Description */}
          <div className="mt-4 space-y-5 font-secondary text-sm sm:text-base">
            <p>Organic products cover a broad range of functionality of crops and plants. All are eco-friendly and give your garden greener.</p>
          </div>

          <hr className="mt-5 border border-gray-200" />

          {/* Responsive Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 font-secondary text-sm sm:text-base">
            <p className="text-center sm:text-left mb-4 sm:mb-0">
              Showing 1 - {OrganicproductData.length} of {OrganicproductData.length} products
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
              {OrganicproductData.map((OrganicProduct) => (
                <Link
                  to={{
                    pathname: `/organicproduct/${encodeURIComponent(OrganicProduct.name)}`,
                    state: { OrganicproductData: OrganicProduct },
                  }}
                  key={OrganicProduct.id}
                  className="border border-x-slate-200 border-solid rounded-lg overflow-hidden"
                >
                  <div className="image-container w-full h-48 sm:h-56 md:h-64 lg:h-72">
                    {OrganicProduct.image && (
                      <img
                        className="w-full h-full object-cover"
                        src={`data:image/avif;base64,${OrganicProduct.image}`}
                        alt={OrganicProduct.name}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold font-primary">{OrganicProduct.name}</h2>
                    <p className="text-sm text-gray-600 font-secondary font-semibold">{OrganicProduct.description}</p>
                    <p className="text-red-500 font-secondary">{OrganicProduct.salePrice}</p>
                    <p className="text-green-600 font-secondary font-medium">{OrganicProduct.reviews}</p>
                    <p className="text-gray-600 font-secondary">{OrganicProduct.stockStatus}</p>
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

export default Organic;
