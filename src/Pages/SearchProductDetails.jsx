import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
const SearchProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('50 ml');
    const [count, setCount] = useState(1);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`/api/product/${id}`, { credentials: "include" });
                if (!response.ok) {
                    throw new Error("Failed to fetch product details.");
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError("Could not load product details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/getreview/${product.id}`); // Pass the correct ID
            if (response.ok) {
                const reviewData = await response.json();
                setReviews(reviewData);
            } else {
                console.error('Failed to fetch reviews:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSizeChange = (newSize) => {
        setSelectedSize(newSize);
        // Prepare updated product data based on selected size
        const updatedData = {
            reviews: newSize === '50 ml' ? product.review_50 : product.review_100,
            save: newSize === '50 ml' ? product.save_50 : product.save_100,
            price: newSize === '50 ml' ? product.price_small : product.salePrice,
        };

        // Update the product state with the new values
        setProduct((prevData) => ({
            ...prevData,
            ...updatedData,
        }));
    };

    useEffect(() => {
        if (product && !product.reviews) {
            // Only call handleSizeChange when product is initialized
            handleSizeChange("50 ml");
        }
    }, [product]);

    useEffect(() => {
        if (!product?.id) {
            fetchReviews()
        }
    }, [product?.id])



    if (loading) {
        return <div className="text-center py-4 text-lg">Loading product details...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-lg text-red-500">{error}</div>;
    }

    if (!product) {
        return <div className="text-center py-4 text-lg">Product not found.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <div className="flex">
                {/* Left Side */}
                <div className="w-1/2 bg-white text-center ml-12 border-r-2 border-l-2 border-t-2 border-b-2">
                    <img
                        className="h-28 border-2 border-blue-500"
                        src={`data:image/avif;base64, ${product.image}`}
                        alt={product.name}
                    />
                    {/* this is a big image */}
                    <img
                        src={`data:image/avif;base64,${product.image}`}
                        alt={product.name}
                        className="h-[31rem] object-cover mx-auto overflow-hidden"
                    />
                    <p className="text-gray-500 mb-4">
                        <SearchIcon /> Roll over image to zoom in
                    </p>
                </div>
                <hr className="border-[2rem] border-gray-100 border-r" />

                {/* Right Side */}
                <div className="w-1/2 bg-white text-left ml-8 p-4 mr-8 border-r-2 border-l-2 border-t-2 border-b-2">
                    <span>ven</span>
                    <h1 className="text-2xl font-[#1e2d7d]">{product?.name}</h1>
                    <p className="mt-5 mb-3">
                        <StarIcon color="warning" />
                        <StarIcon color="warning" />
                        <StarIcon color="warning" />
                        <StarIcon color="warning" />
                        <StarIcon color="warning" /> {reviews.length} reviews
                    </p>
                    <span className="bg-green-300">Save {product.save}</span>
                    <div className="flex mt-3 mb-3">
                        <p className="text-lg font-semibold text-gray-800">
                            <span className="text-blue-600">{product.brands}</span>
                        </p>
                        <div className="flex ml-[35.5rem] space-x-3">
                            <FacebookIcon
                                color="info"
                                className="cursor-pointer hover:text-blue-700"
                            />
                            <PinterestIcon
                                color="info"
                                className="cursor-pointer hover:text-blue-700"
                            />
                            <TwitterIcon
                                color="info"
                                className="cursor-pointer hover:text-blue-700"
                            />
                            <EmailIcon
                                color="info"
                                className="cursor-pointer hover:text-blue-700"
                            />
                        </div>
                    </div>
                    <hr className="border-[1px] border-gray-800 border-r" />
                    <p className="text-[#1e2d7d] mt-8">Size: <span className="text-xl">{selectedSize}</span></p>
                    <div className="flex mt-8 space-x-3">
                        <button
                            className={`text-xl border-2 rounded-md py-1 px-3 focus:outline-none ${selectedSize === '50 ml' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-700 border-gray-300'}`}
                            onClick={() => handleSizeChange('50 ml')}
                        >
                            {product.small_50}
                        </button>
                        <button
                            className={`text-xl border-2 rounded-md py-1 px-3 focus:outline-none ${selectedSize === '100 ml' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-700 border-gray-300'}`}
                            onClick={() => handleSizeChange('100 ml')}
                        >
                            {product.big_100}
                        </button>
                    </div>
                    <p className="text-[#1e2d7d] mt-5 text-lg font-semibold">Expiry Date: <span className="text-black">09-Dec-2024</span></p>
                    <div className="flex gap-6 mt-5">
                        <span className="text-xl text-gray-700 bg-[#f1fdff] border-2 border-[#00badb] rounded-md py-2 px-4 cursor-pointer">
                            09-Dec-2024
                        </span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <div className="text-2xl mt-3 gap-12 font-semibold flex items-baseline">
                                <span>Price:</span>
                                <span className="text-[#00badb]">
                                    {/* Calculate the displayed price based on selected size and current product */}
                                    {selectedSize === '50 ml'
                                        ? product.price_small - product.save
                                        : product.salePrice - product.save}
                                </span>
                                {/* Show the original price with a strikethrough if there is a discount */}
                                {selectedSize === '50 ml' && product.price_small ? (
                                    <span className="text-base text-gray-700 line-through ml-3">
                                        {product.price_small}
                                    </span>
                                ) : selectedSize === '100 ml' && product.salePrice ? (
                                    <span className="text-base text-gray-700 line-through ml-3">
                                        {product.salePrice}
                                    </span>
                                ) : null}
                            </div>

                            <p className="text-sm mt-3 ml-[107px] text-gray-700">
                                Tax included
                                <span className="text-[#00badb] cursor-pointer">
                                    {" "}
                                    Shipping calculated
                                </span>{" "}
                                at checkout
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-6">
                        <div className="text-2xl font-semibold space-x-9 ">
                            Quantity :
                            <div className="text-4xl space-x-12 text-red-900 ml-32 overflow-hidden -mt-9 item-center border-[2px] border-t-2 border-b-2">
                                <button className="text-gray-400 hover:text-black border-r-2 ml-5 items-center">
                                    <button className="mr-5" onClick={handleIncrement}>
                                        +
                                    </button>
                                </button>
                                <span className="text-gray-700 border-r-2 items-center">
                                    <span className="mr-5 -ml-5">{count}</span>
                                </span>
                                <button className="items-center">
                                    <button
                                        onClick={handleDecrement}
                                        className="-ml-5 items-center"
                                    >
                                        <button className="mr-5 hover:text-black text-gray-400">
                                            -
                                        </button>
                                    </button>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center content-center min-h-12">

                            <button onClick={""} className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 ml-4 -mt-2 rounded hover:cursor-pointer">
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchProductDetails;
