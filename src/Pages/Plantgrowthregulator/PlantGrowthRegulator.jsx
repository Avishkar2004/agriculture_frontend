import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PlantGrowthRegulators from "../../Components/Banner/PlantGrowthRegulator.jpg";
import Recentlyviewed from '../Recentlyviewed';
import ShimmerCard from '../ShimmerCard';

const PlantGrowthRegulator = () => {
  const [PlantgrowthregulatorData, setPlantgrowthregulatorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("PlantGrowthRegulatorData");
        if (cachedData) {
          setPlantgrowthregulatorData(JSON.parse(cachedData));
          setLoading(false);
        } else {
          const response = await fetch("/plantgrowthregulator");
          if (!response.ok) {
            throw new Error("Failed to fetch Plantgrowthregulator data");
          }
          const data = await response.json();
          localStorage.setItem("PlantGrowthRegulatorData", JSON.stringify(data));
          setPlantgrowthregulatorData(data);
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
          <span>Plant Growth Regulator (PGR) &gt;</span>
        </span>
      </div>
      {/* Main Content */}
      <div className="flex flex-col">
        <div className="w-full bg-white p-4 border border-gray-200 rounded-lg">
          {/* Banner Image */}
          <div className="flex justify-center pl-5 w-full h-[55%]">
            <img
              src={PlantGrowthRegulators}
              alt=""
              className="w-full max-h-[300px] rounded-lg"
            />
          </div>
          {/* Title */}
          <div className="text-center mt-5 font-primary text-2xl sm:text-3xl text-blue-500">
            <h1>Plant Growth Regulator (PGR)</h1>
          </div>

          {/* Description */}
          <div className="mt-4 space-y-5 font-secondary text-sm sm:text-base">
            <p>
              Plant Growth Regulator (PGR) is hormone-based chemicals that regulate the plants at the inner label. It shows the results in a few hours. When the micronutrients fail to give faster growth results, you can apply the ho plant growth regulators such as Planofix, Miraculan, Booster:2, Phytozyme, or seaweed extract.
            </p>
            <p>
              Unlike micro-nutrients, it has side effects if applied frequently or more doses. Before it used, everyone keeps notice of the applicable doses of the products mentioned on the packets. The dose of all the products varies.
            </p>
          </div>
          <hr className="mt-5 border border-gray-200" />
          {/* Responsive Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 font-secondary text-sm sm:text-base">
            <p className="text-center sm:text-left mb-4 sm:mb-0">
              Showing 1 - {PlantgrowthregulatorData.length} of {PlantgrowthregulatorData.length} products
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
                    <option value="10 per page">10 per page</option>
                    <option value="20 per page">20 per page</option>
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
              {PlantgrowthregulatorData.map((PGRProduct) => (
                <Link
                  to={{
                    pathname: `/plantgrowthregulator/${PGRProduct.name}`,
                    state: { PGRProduct: PGRProduct },
                  }}
                  key={PGRProduct.id}
                  className="border border-gray-200 rounded-lg overflow-hidden transition-shadow"
                >
                  <div className="image-container">
                    <img
                      src={`data:image/avif;base64, ${PGRProduct.image}`}
                      alt={PGRProduct.altTag || PGRProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold font-primary">{PGRProduct.name}</h2>
                    <p className="text-sm text-gray-600 font-secondary font-semibold">{PGRProduct.description}</p>
                    <p className="text-red-500 font-secondary">{PGRProduct.salePrice}</p>
                    <p className="text-green-600 font-secondary font-medium">{PGRProduct.reviews}</p>
                    <p className="text-gray-600 font-secondary">{PGRProduct.stockStatus}</p>
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

export default PlantGrowthRegulator;