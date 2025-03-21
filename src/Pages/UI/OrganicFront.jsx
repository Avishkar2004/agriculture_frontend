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
        const response = await fetch("/organicproduct");
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
    <div className="container mx-auto mt-10 mb-5 px-2 sm:px-4">
      <div className="flex justify-between font-bold items-center">
        <h1 className="text-[#1e2d7d] text-bold text-2xl font-primary">
          Organic Product
        </h1>
        <Link to="/organicproduct"
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
          ) : Array.isArray(organicProductData) && organicProductData.length > 0 ? (
            organicProductData.map((organicProduct) => (
              <Link
                to={{
                  pathname: `/organicproduct/${encodeURIComponent(organicProduct.name)}`,
                  state: { OrganicproductData: organicProduct },
                }}
                key={organicProduct.id}
                className="border border-x-slate-200 border-solid rounded-lg overflow-hidden"
              >
                <div className="image-container w-full h-48 sm:h-56 md:h-64 lg:h-72">
                  {organicProduct.image && (
                    <img
                      className="w-full h-full object-cover"
                      src={`data:image/avif;base64,${organicProduct.image}`}
                      alt={organicProduct.name}
                    />
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="text-base sm:text-lg font-semibold font-primary">
                    {organicProduct.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-secondary font-semibold">
                    {organicProduct.description}
                  </p>
                  <p className="text-red-500 font-secondary mt-2 sm:mt-3 font-medium text-sm sm:text-lg">
                    {organicProduct.salePrice}
                  </p>
                  <p className="text-gray-600 font-secondary text-xs sm:text-sm mt-1 sm:mt-2">
                    {organicProduct.review_50} Reviews
                  </p>
                  <p className="text-green-600 font-medium mt-1 sm:mt-2 text-xs sm:text-sm">
                    {organicProduct.stockStatus}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No products available</p>
          )}
        </div>
      )}

      <hr className="mt-12 border-0 h-px bg-gray-300 rounded-full shadow-md" />
    </div>

  );
};

export default OrganicFront;
