import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BannerFungicide from '../../Components/BestFungicides/BannerFungi.webp';
import Recentlyviewed from "../Recentlyviewed";
import ShimmerCard from "../ShimmerCard";

const BestFungicides = () => {
  const [fungicidesData, setFungicidesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("fungicidesData")
        if (cachedData) {
          setFungicidesData(JSON.parse(cachedData))
          setLoading(false)
        } else {

          const response = await fetch("/fungicides");
          if (!response.ok) {
            throw new Error("Failed to fetch fungicides data");
          }
          const data = await response.json();
          localStorage.setItem("fungicidesData", JSON.stringify(data))
          setFungicidesData(data);
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
      <Link
        to="/ "
        className="text-black text-sm hover:text-blue-600 font-primary ml-4"
      >
        Home &gt;
      </Link>
      <span className="text-black text-sm ml-2 font-secondary">
        Buy  Fungicide Online &gt;
      </span>
      <div className="container flex mt-10">
        <div className="w-full bg-white p-4 border-[1px] ">
          <div className="flex justify-center pl-5 w-full h-[10%]">
            <img
              className="w-[100%] mr-2 -ml-2"
              src={BannerFungicide}
              alt=""
            />
          </div>
          <div className="ml-3 mt-5 font-primary text-xl text-blue-500">
            <h1>Buy Fungicides Online</h1>
          </div>
          <div className="mt-4 ml-3 space-y-5 font-secondary text-base">
            <p>
              Fungicides is the most useful thing for agriculture so farmers can use it for controlling fungi.
            </p>
          </div>
          <hr className="mt-5 border-[1px]" />
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6 md:space-x-12 lg:space-x-16 xl:space-x-24 ml-3 mt-5 font-secondary justify-center text-md">
            <p className="text-center sm:text-left">
              Showing 1 - {fungicidesData.length} of {fungicidesData.length} products
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
          {loading ? (
            <div>
              <ShimmerCard count={3} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
              {fungicidesData.map((product) => (
                <Link
                  to={{
                    pathname: `/fungicides/${encodeURIComponent(product.id)}`,
                    state: { productData: product },
                  }}
                  key={product.id}
                  className="border border-x-slate-200 border-solid"
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
      <Recentlyviewed />
    </div>
  );
};

export default BestFungicides;
