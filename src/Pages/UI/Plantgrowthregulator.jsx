import EastIcon from "@mui/icons-material/East";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader";

const Plantgrowthregulator = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false)


  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data.slice(0, 1000) || []);
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
    <div className="container mx-auto mt-10 mb-5">
      <div className="flex justify-between font-bold">
        <h1 className="text-[#1e2d7d] text-bold text-2xl font-primary">
          PGR collection
        </h1>
        <h1 className="text-[#00badb] transition hover:-translate-x-5 font-[16px] duration-500 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          View All
          {isHovered && <EastIcon />}
        </h1>
      </div>
      {loading ? (
        <div>
          <Loader count={3} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5">
          {error ? (
            <p>{<Loader />}</p>
          ) : loading ? (
            <p>Loading...</p>
          ) : Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <Link
                to={{
                  pathname: `/plantgrowthregulator/${product.name}`,
                  state: { PGRProduct: product },
                }}
                key={product.id}
                className="border border-x-slate-200 border-solid"
              >

                <div className="image-container">
                  {product.image && (
                    <div>
                      <img
                        className="w-full h-full object-cover"
                        src={`data:image/avif;base64,${product.image}`}
                        alt={product.name}
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold font-primary">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 font-secondary font-semibold">
                    {product.description}
                  </p>
                  <p className="text-red-500 font-secondary mt-3 font-medium text-lg">
                    {product.salePrice}
                  </p>
                  <p className="text-gray-600 font-secondary text-sm mt-2">
                    {product.review_50} Reviews
                  </p>
                  <p className="text-green-600 font-secondary mt-2">
                    {product.stockStatus}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      )}
      <hr className="mt-12 border-0 h-px bg-gray-300 rounded-full shadow-md" />
    </div>
  );
};

export default Plantgrowthregulator;  
