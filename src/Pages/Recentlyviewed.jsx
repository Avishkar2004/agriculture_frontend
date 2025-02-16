import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { parentObject } from "../Data";

const RecentlyViewed = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4, // Default number of slides
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="container mt-12 mb-20 mx-auto px-2 sm:px-4">
      {/* Header Section */}
      <div className="flex justify-between items-center font-bold mb-5">
        <h1 className="text-[#1e2d7d] text-bold text-2xl font-primary">
          Recently Viewed
        </h1>
        <h1 className="text-[#00badb] transition hover:-translate-x-5 text-[16px] duration-500 cursor-pointer">
          View All
        </h1>
      </div>

      {/* Carousel */}
      <Slider {...settings}>
        {parentObject.products.map((product, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            <div className="image-container">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-semibold font-primary">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-secondary font-semibold">
                {product.description}
              </p>
              <p className="text-red-500 font-secondary mt-1 sm:mt-2 font-medium text-sm sm:text-lg">
                {product.salePrice}
              </p>
              <p className="text-green-600 font-secondary mt-1 sm:mt-2 text-xs sm:text-sm">
                {product.reviews} Reviews
              </p>
              <p className="text-gray-600 font-secondary mt-1 sm:mt-2 text-xs sm:text-sm">
                {product.stockStatus}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecentlyViewed;
