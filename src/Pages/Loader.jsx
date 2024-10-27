import React from "react";

const Loader = ({ count }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="border border-x-slate-200 border-solid rounded-lg p-4 animate-pulse"
                >
                    <div className="bg-gray-300 h-40 w-full rounded-md mb-4"></div>
                    <div className="bg-gray-300 h-6 w-3/4 mb-2 rounded"></div>
                    <div className="bg-gray-300 h-4 w-full mb-2 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/2 mb-4 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/4 mb-2 rounded"></div>
                    <div className="bg-gray-300 h-4 w-1/3 rounded"></div>
                </div>
            ))}
        </div>
    );
};

export default Loader;
