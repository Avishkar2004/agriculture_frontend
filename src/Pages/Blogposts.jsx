import React from "react";
import UnderstandingUses from "../Components/Blogs/5_cheapest_micronutrients_for_vegetable_cultivation_in_2022_2_600x.webp";
import Learn from "../Components/Blogs/6e0f4ff7532d4585125d980cffc520ca_600x.webp";
import BestWay from "../Components/Blogs/Control_of_Red_Spider_Mites_600x.webp";

const Blogposts = () => {
  return (
    <div className="container mx-auto mt-10 mb-5 ">
      <div className="flex justify-between font-bold">
        <h1 className="text-[#1e2d7d] text-bold text-2xl font-primary">
          Blog posts
        </h1>
        <h1 className="text-[#00badb] transition hover:-translate-x-5 font-[16px] duration-500 cursor-pointer">
          View All
        </h1>
      </div>
      <div>
        <div className="flex gap-8 mt-12">
          <div className="text-center">
            <img
              className="h-60 hover:scale-105 duration-300"
              src={BestWay}
              alt=""
            />
            <p className="mt-2 text-sm font-semibold text-start font-secondary">
              Control of Red Spider Mites on Crops
            </p>
            <p className="mt-1 text-xs text-blue-500 text-start">
              By Prasanta Kumar Pradhan | June 14, 2023
            </p>
          </div>
          <div className="text-center">
            <img
              className="h-60 hover:scale-105 duration-300"
              src={UnderstandingUses}
              alt=""
            />
            <p className="mt-2 text-sm font-semibold text-start font-secondary">
              Understanding Uses of Micronutrients in Vegetable Cultivation
            </p>
            <p className="mt-1 text-xs text-blue-500 text-start">
              By Prasanta Kumar Pradhan | June 14, 2023
            </p>
          </div>
          <div className="text-center">
            <img
              className="h-60 hover:scale-105 duration-300"
              src={Learn}
              alt=""
            />
            <p className="mt-2 text-sm font-semibold text-start font-secondary">
              Learn About Crop Management Techniques
            </p>
            <p className="mt-1 text-xs text-blue-500 text-start">
              By Prasanta Kumar Pradhan | June 14, 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogposts;
