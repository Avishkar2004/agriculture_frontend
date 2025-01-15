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
    <div className="container mt-3">

      <div className="space-x-52 ml-7 mt-4 mb-4">
        <div className="flex text-sm gap text-gray-500 font-secondary">
          <span className="space-x-2 ml-6">
            <Link to="/" className="hover:text-blue-500" >
              Home &gt;
            </Link>
            <span className="text-sm">
              Buy Organic Product Online &gt;
            </span>
          </span>
        </div>
      </div>

      <div className="container flex mt-4">
        <div className="w-full bg-white p-4 border-[1px]">
          <div className="flex justify-center pl-5 w-full h-[15%]">
            <img className="w-full" src={OrganicProduct} alt="" />
          </div>
          <div className="ml-3 mt-5 font-primary text-xl text-blue-500">
            <h1>Buy Organic Product Online</h1>
          </div>
          <div className="mt-4 ml-3 space-y-5 font-secondary text-base">
            <p>
              Organic products cover a broad range of functionality of crops and plants. All are eco-friendly and give your garden greener.
            </p>
          </div>
          <hr className="mt-5 border-[1px]" />
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6 md:space-x-12 lg:space-x-16 xl:space-x-24 ml-3 mt-5 font-secondary justify-center text-md">
            <p className="text-center sm:text-left">
              Showing 1 - {OrganicproductData.length} of {OrganicproductData.length} products
            </p>

            {/* Display dropdown */}
            <div className="flex items-center justify-center sm:justify-start">
              <label>
                Display:
                <select name="Display" className="ml-2 p-1 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="24 per page">24 per page</option>
                  <option value="36 per page">36 per page</option>
                  <option value="48 per page">48 per page</option>
                </select>
              </label>
            </div>

            {/* Sort By dropdown */}
            <div className="flex items-center justify-center sm:justify-start">
              <label>
                Sort By:
                <select name="Sort By" className="ml-2 p-1 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="best-selling">Best Selling</option>
                  <option value="top-rated">Top Rated</option>
                  <option value="most-reviewed">Most Reviewed</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </label>
            </div>
          </div>
          <hr className="mt-5 border-[1px]" />
          {/* if you want to put gap in between components you need gap */}
          {loading ? (
            <div>
              < ShimmerCard count={3} /> {/* Use a beautiful loader component */}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
              {OrganicproductData.map((OrganicProduct) => (
                <Link
                  to={{
                    pathname: `/organicproduct/${OrganicProduct.name}`,
                    state: { OrganicproductData: OrganicProduct },
                  }}
                  key={OrganicProduct.id}
                  className="border border-x-slate-200 border-solid"
                >
                  <div className="image-container">
                    <img
                      src={`data:image/avif;base64, ${OrganicProduct.image}`}
                      alt={OrganicProduct.altTag || OrganicProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold font-primary">
                      {OrganicProduct.name}
                    </h2>
                    <p className="text-sm text-gray-600 font-secondary font-semibold">
                      {OrganicProduct.description}
                    </p>
                    <p className="text-red-500 font-secondary">{OrganicProduct.salePrice}</p>
                    <p className="text-green-600 font-secondary font-medium">
                      {OrganicProduct.reviews}
                    </p>
                    <p className="text-gray-600 font-secondary">
                      {OrganicProduct.stockStatus}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
      <Recentlyviewed />
    </div>
  );
};

export default Organic;
