import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import TwitterIcon from "@mui/icons-material/Twitter";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useAuth } from "../actions/authContext";
import Reviews from "./Reviews";
const SearchProductDetails = () => {
    const { getAuthToken, authenticatedUser } = useAuth() || {}
    const { id } = useParams();
    const history = useHistory();
    const location = useLocation();

    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('50 ml');
    const [count, setCount] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [cartData, setCartData] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`/api/product/${id}`, { credentials: "include" });
                if (!response.ok) {
                    throw new Error("Failed to fetch product details.");
                }
                const data = await response.json();
                setProductData(data);
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

    const handleAddToCart = async () => {
        try {
            const { id, name, price, image, quantity, productType } = productData

            const response = await fetch('/cart', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    name,
                    price,
                    image,
                    quantity: count,
                    productType: "plantgrowthregulator" // or any other product type

                }),
                credentials: "include"
            })
            if (response.ok) {
                const responseData = await response.json()
                setCartData(responseData.cart)
            } else if (response.status === 401) {
                alert('You must be logged in to add items to the cart.');
                history.push({
                    pathname: "/signin",
                    state: { from: location } //! Pass current location for redirect after login / sign in
                })
            } else {
                console.error('Failed to add item to cart');
            }
        } catch (error) {
            console.error("Error adding item to cart:", error)
        }
    }

    const handleBuyNow = (e) => {
        e.preventDefault();
        const token = getAuthToken();
        if (!token) {
            alert("You must be logged in to buy this product");
            history.push({
                pathname: "/signin",
                state: { from: location }
            });
        } else {
            const finalPrice = selectedSize === "50 ml"
                ? productData.price_small - productData.save
                : productData.salePrice - productData.save

            const totalPrice = finalPrice * count

            history.push("/BuyNow", { productData: { ...productData, quantity: count, totalPrice } })
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/getreview/${productData.id}`); // Pass the correct ID
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
            reviews: newSize === '50 ml' ? productData.review_50 : productData.review_100,
            save: newSize === '50 ml' ? productData.save_50 : productData.save_100,
            price: newSize === '50 ml' ? productData.price_small : productData.salePrice,
        };

        // Update the product state with the new values
        setProductData((prevData) => ({
            ...prevData,
            ...updatedData,
        }));
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0; // Handle case when there are no reviews
        const totalRating = reviews.reduce((acc, review) => acc + (review.rating || 0), 0); // Default to 0 if rating is undefined
        return (totalRating / reviews.length).toFixed(1); // Rounded to 1 decimal place
    }

    const averageRating = calculateAverageRating() // Call the fucntion

    useEffect(() => {
        if (productData && !productData.reviews) {
            // Only call handleSizeChange when product is initialized
            handleSizeChange("50 ml");
        }
    }, [productData]);

    useEffect(() => {
        if (productData?.id) {
            fetchReviews()
        }
    }, [productData?.id])

    if (loading) {
        return <div className="text-center py-4 text-lg">Loading product details...</div>;
    }
    if (error) {
        return <div className="text-center py-4 text-lg text-red-500">{error}</div>;
    }
    if (!productData) {
        return <div className="text-center py-4 text-lg">Product not found.</div>;
    }
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col p-2 lg:p-2">
            <div className="flex flex-col lg:flex-row">
                {/* Left Side - Product Images */}
                <div className="w-full lg:w-1/2 bg-white text-center p-6 border-2 border-gray-200 rounded-lg">
                    <img
                        className="h-28 border-2 border-blue-500 rounded-lg mb-4"
                        src={`data:image/avif;base64, ${productData.image}`}
                        alt={productData.name}
                    />
                    <img
                        src={`data:image/avif;base64,${productData.image}`}
                        alt={productData.name}
                        className="h-[31rem] object-cover mx-auto overflow-hidden"
                    />
                    <p className="text-gray-500 mt-4 flex items-center justify-center">
                        <SearchIcon className="mr-2" /> Roll over image to zoom in
                    </p>
                </div>

                {/* Right Side - Product Info */}
                <div className="w-full lg:w-1/2 bg-white text-left p-6 lg:ml-8 mt-6 lg:mt-0 border-2 border-gray-200 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-[#1e2d7d]">{productData?.name ?? "Product Name"}</h1>
                    <div className="flex items-center mt-4">
                        <div className="flex">
                            {Array.from({ length: 5 }, (_, index) => (
                                <StarIcon
                                    key={index}
                                    color={index < Math.round(averageRating) ? "warning" : "disabled"}
                                />
                            ))}
                        </div>
                        <span className="ml-2">{averageRating}</span>
                        <span className="text-sm text-gray-500 ml-2">({reviews.length} reviews)</span>
                    </div>
                    <span className="bg-green-300 text-green-800 px-2 py-1 rounded text-sm mt-2 inline-block">
                        Save {productData.save}
                    </span>
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-lg font-semibold text-gray-800">
                            <span className="text-blue-600">{productData.brands}</span>
                        </p>
                        <div className="flex space-x-3">
                            <FacebookIcon className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors" />
                            <PinterestIcon className="text-red-600 cursor-pointer hover:text-red-700 transition-colors" />
                            <TwitterIcon className="text-blue-400 cursor-pointer hover:text-blue-500 transition-colors" />
                            <EmailIcon className="text-gray-600 cursor-pointer hover:text-gray-700 transition-colors" />
                        </div>
                    </div>
                    <hr className="border-t border-gray-300 my-4" />
                    <p className="text-[#1e2d7d] mt-4">Size: <span className="text-xl font-semibold">{selectedSize}</span></p>
                    <div className="flex mt-4 space-x-3">
                        <button
                            className={`text-xl border-2 rounded-md py-1 px-3 focus:outline-none transition-colors ${selectedSize === '50 ml' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'}`}
                            onClick={() => handleSizeChange('50 ml')}
                        >
                            {productData.small_50}
                        </button>
                        <button
                            className={`text-xl border-2 rounded-md py-1 px-3 focus:outline-none transition-colors ${selectedSize === '100 ml' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'}`}
                            onClick={() => handleSizeChange('100 ml')}
                        >
                            {productData.big_100}
                        </button>
                    </div>
                    <p className="text-[#1e2d7d] mt-4 text-lg font-semibold">Expiry Date: <span className="text-black">09-Dec-2024</span></p>
                    <div className="flex gap-6 mt-4">
                        <span className="text-xl text-gray-700 bg-[#f1fdff] border-2 border-[#00badb] rounded-md py-2 px-4 cursor-pointer hover:bg-[#e0f7fa] transition-colors">
                            09-Dec-2024
                        </span>
                    </div>
                    <div className="mt-6">
                        <div className="text-2xl font-semibold flex items-baseline gap-4">
                            <span>Price:</span>
                            <span className="text-[#00badb]">
                                {selectedSize === '50 ml'
                                    ? productData.price_small - productData.save
                                    : productData.salePrice - productData.save}
                            </span>
                            {(selectedSize === '50 ml' && productData.price_small) || (selectedSize === '100 ml' && productData.salePrice) ? (
                                <span className="text-base text-gray-700 line-through">
                                    {selectedSize === '50 ml' ? productData.price_small : productData.salePrice}
                                </span>
                            ) : null}
                        </div>
                        <p className="text-sm mt-2 text-gray-700">
                            Tax included. <span className="text-[#00badb] cursor-pointer hover:underline">Shipping calculated</span> at checkout.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-semibold">Quantity:</span>
                            <div className="flex items-center border-2 border-gray-300 rounded-md">
                                <button
                                    className="px-4 py-2 text-gray-400 hover:text-black border-r border-gray-300 transition-colors"
                                    onClick={handleDecrement}
                                >
                                    -
                                </button>
                                <span className="px-6 text-lg text-gray-700">{count}</span>
                                <button
                                    className="px-4 py-2 text-gray-400 hover:text-black border-l border-gray-300 transition-colors"
                                    onClick={handleIncrement}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleBuyNow}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-colors"
                            >
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Reviews reviews={reviews} authenticatedUser={authenticatedUser} productId={productData.id} fetchReviews={fetchReviews} />
        </div>
    );
};

export default SearchProductDetails;
