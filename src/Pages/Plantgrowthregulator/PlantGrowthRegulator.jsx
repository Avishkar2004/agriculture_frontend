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
        const cachedData = localStorage.getItem("PlantGrowthRegulatorData")
        if (cachedData) {
          setPlantgrowthregulatorData(JSON.parse(cachedData))
          setLoading(false)
        } else {
          const response = await fetch("/plantgrowthregulator");
          if (!response.ok) {
            throw new Error("Failed to fetch Plantgrowthregulator data");
          }
          const data = await response.json();
          localStorage.setItem("PlantGrowthRegulatorData", JSON.stringify(data))
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
    <div className="container mt-3">
      <div className="space-x-52 ml-7 mt-4 mb-4">
        <div className="flex text-sm gap text-gray-500 font-secondary">
          <span className="space-x-2 ml-6">
            <Link to="/" className="hover:text-blue-500" >
              Home &gt;
            </Link>
            <span className="text-sm">
              Plant Growth Regulator (PGR) &gt;
            </span>
            
          </span>

        </div>
      </div>

      <div className="container flex mt-4">
        <div className="w-full bg-white p-4 border-[1px]">
          <div className="flex justify-center">
            <img src={PlantGrowthRegulators} alt="" className="w-full max-w-[800px]" />
          </div>
          <div className="text-center mt-5 font-primary text-3xl text-blue-500">
            <h1>Plant Growth Regulator (PGR)</h1>
          </div>
          <div className="mt-4 space-y-5 font-secondary text-base">
            <p>
              Plant Growth Regulator (PGR) is hormone-based chemicals that regulate the plants at the inner label. It shows the results in a few hours. When the micronutrients fail to give faster growth results, you can apply the ho plant growth regulators such as Planofix, Miraculan, Booster:2, Phytozyme, or seaweed extract.
            </p>
            <p>Unlike micro-nutrients, it has side effects if applied frequently or more doses. Before it used, everyone keeps notice of the applicable doses of the products mentioned on the packets. The dose of all the products varies.</p>
          </div>
          <hr className="mt-5 border-[1px]" />

          {/* Responsive controls for display and sort */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6 md:space-x-12 lg:space-x-16 xl:space-x-24 ml-3 mt-5 font-secondary justify-center text-md">
            <p className="text-center sm:text-left">
              Showing 1 - {PlantgrowthregulatorData.length} of {PlantgrowthregulatorData.length} products
            </p>

            {/* Display dropdown */}
            <div className="flex items-center justify-center sm:justify-start">
              <label>
                Display:
                <select name="Display" className="ml-2 p-1 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="24 per page">10 per page</option>
                  <option value="36 per page">20 per page</option>
                  <option value="48 per page">30 per page</option>
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5">
              {PlantgrowthregulatorData.map((PGRProduct) => (
                <Link
                  to={{
                    pathname: `/plantgrowthregulator/${PGRProduct.name}`,
                    state: { PGRProduct: PGRProduct },
                  }}
                  key={PGRProduct.id}
                  className="border border-x-slate-200 border-solid"
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
      <Recentlyviewed />
    </div>
  );
}

export default PlantGrowthRegulator;
