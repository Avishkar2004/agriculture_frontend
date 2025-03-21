import EastIcon from "@mui/icons-material/East";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader";

const MicronutrientUI = () => {
  const [micronutrientData, setMicronutrientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/micro-nutrients");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMicronutrientData(data.slice(0, 1000) || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto mt-10 mb-5 px-2 sm:px-4">
      <div className="flex justify-between font-bold items-center">
        <h1 className="text-[#1e2d7d] text-bold text-2xl font-primary">
          Micronutrients
        </h1>
        <Link to="/micro-nutrients"
          className="text-[#00badb] transition hover:-translate-x-5 font-[16px] duration-500 cursor-pointer whitespace-nowrap"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          View All {isHovered && <EastIcon />}
        </Link>
      </div>

      {loading ? (
        <div>
          <Loader count={3} />
        </div>
      ) : (
        <div className="grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5 gap-4">
          {error ? (
            <p>{<Loader />}</p>
          ) : Array.isArray(micronutrientData) && micronutrientData.length > 0 ? (
            micronutrientData.map((product) => (
              <Link
                to={{
                  pathname: `/micro-nutrients/${encodeURIComponent(product.name)}`,
                  state: { micronutrientProduct: product },
                }}
                key={product.id}
                className="border border-x-slate-200 border-solid rounded-lg overflow-hidden"
              >
                <div className="image-container w-full h-48 sm:h-56 md:h-64 lg:h-72">
                  {product.image && (
                    <img
                      className="w-full h-full object-cover"
                      src={`data:image/avif;base64,${product.image}`}
                      alt={product.name}
                    />
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="text-base sm:text-lg font-semibold font-primary">
                    {product.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-secondary font-semibold">
                    {product.description}
                  </p>
                  <p className="text-red-500 font-secondary mt-2 sm:mt-3 font-medium text-sm sm:text-lg">
                    {product.salePrice}
                  </p>
                  <p className="text-gray-600 font-secondary text-xs sm:text-sm mt-1 sm:mt-2">
                    {product.review_50} Reviews
                  </p>
                  <p className="text-green-600 font-medium mt-1 sm:mt-2 text-xs sm:text-sm">
                    {product.stockStatus}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No micronutrient products available</p>
          )}
        </div>
      )}

      <hr className="mt-12 border-0 h-px bg-gray-300 rounded-full shadow-md" />
    </div>

  );
};

export default MicronutrientUI;
