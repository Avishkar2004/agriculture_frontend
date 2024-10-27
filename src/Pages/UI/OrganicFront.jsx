import EastIcon from "@mui/icons-material/East";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader";

const OrganicFront = () => {
  const [organicProductData, setOrganicProductData] = useState([]);
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
        const response = await fetch("http://localhost:8080/organicproduct");
        if (!response.ok) {
          throw new Error("Failed to fetch organic product data");
        }
        const data = await response.json();
        setOrganicProductData(data);
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
          Organic Product
        </h1>
        <h1
          className="text-[#00badb] transition hover:-translate-x-5 font-[16px] duration-500 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          View All {isHovered && <EastIcon />}
        </h1>
      </div>
      {loading ? (
        <div><Loader count={3} /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5">
          {error ? (
            <p>{<Loader />}</p>
          ) : Array.isArray(organicProductData) && organicProductData.length > 0 ? (
            organicProductData.map((organicProduct) => (
              <Link
                to={{
                  pathname: `/organicproduct/${encodeURIComponent(organicProduct.name)}`,
                  state: { OrganicproductData: organicProduct }, // Pass state with consistent name
                }}
                key={organicProduct.id}
                className="border border-x-slate-200 border-solid"
              >
                <div className="image-container">
                  {organicProduct.image && (
                    <div>
                      <img
                        className="w-full h-full object-cover"
                        src={`data:image/avif;base64,${organicProduct.image}`}
                        alt={organicProduct.name}
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-base font-light font-primary">{organicProduct.name}</h2>
                  <p className="text-sm text-gray-600 font-secondary font-semibold">
                    {organicProduct.description}
                  </p>
                  <p className="text-red-500 font-secondary mt-3 font-medium text-lg">
                    {organicProduct.salePrice}
                  </p>
                  <p className="text-gray-600 font-secondary text-sm mt-2">
                    {organicProduct.review_50} Reviews
                  </p>
                  <p className="text-green-600 font-secondary mt-2">
                    {organicProduct.stockStatus}
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

export default OrganicFront;
