import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import TwitterIcon from "@mui/icons-material/Twitter";
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../actions/authContext';
import Reviews from '../Reviews';

const ShowMicroProduct = () => {
    const reviewRef = useRef(null)
    const { getAuthToken, authenticatedUser } = useAuth()
    const history = useHistory();
    const location = useLocation();
    const initialMicroShowProduct = (location.state && location.state.micronutrientProduct) || {};
    const [productData, setProductData] = useState(initialMicroShowProduct);
    const [count, setCount] = useState(1);
    const [cartData, setCartData] = useState(null);
    const [selectedSize, setSelectedSize] = useState("50 ml");
    const [reviews, setReviews] = useState([]);

    const fetchNextProduct = async () => {
        try {
            const response = await fetch(`/micro_nutrients/next/${productData.id}`);

            if (response.ok) {
                const nextProduct = await response.json()
                if (nextProduct) {
                    history.push({
                        pathname: `/micro-nutrients/${nextProduct.name}`,
                        state: { micronutrientProduct: nextProduct }
                    })
                    setProductData(nextProduct);
                    setSelectedSize("50 ml")
                }
                else {
                    console.error("No more product available")
                }
            } else {
                console.error("Failed to fetch next product")
            }

        } catch (error) {
            console.error('Error fetching next product:', error);
        }
    };

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        setCount(count - 1 > 0 ? count - 1 : 1); // Ensure count doesn't go below 1
    };

    const handleSizeChange = (newSize) => {
        setSelectedSize(newSize);

        let updatedData;
        if (newSize === '50 ml') {
            updatedData = {
                reviews: initialMicroShowProduct.review_50,
                save: initialMicroShowProduct.save_50,
                price: initialMicroShowProduct.price_small,
            };
        } else if (newSize === '100 ml') {
            updatedData = {
                reviews: initialMicroShowProduct.review_100,
                save: initialMicroShowProduct.save_100,
                price: initialMicroShowProduct.salePrice,
            };
        }

        setProductData((prevData) => ({
            ...prevData,
            ...updatedData,
        }));
    };

    const handleAddToCart = async () => {
        try {
            const { id, name, price, image, quantity, productType } = productData
            // Ensure image is base64-encoded if available
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
                    productType: "micro_nutrients" // or any other product type

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
                    state: { from: location }
                })
            } else {
                console.error('Failed to add item to cart');
            }
        } catch (error) {
            console.error("Error adding item to cart:", error)
        }
    }

    const handleBuyNow = (e) => {
        e.preventDefault()
        const isAuthenticated = getAuthToken()
        if (!isAuthenticated) {
            alert("You must be logged in to buy this product")
            history.push({
                pathname: "/signin",
                state: { from: location }
            })
        } else {
            const finalPrice = selectedSize === "50 ml"
                ? productData.price_small - productData.save
                : productData.salePrice - productData.save
            const totalPrice = finalPrice * count

            history.push("/BuyNow", { productData: { ...productData, quantity: count, totalPrice } })

        }
    }


    const fetchReviews = async () => {
        if (!productData.id) return
        try {
            const response = await fetch(`/api/reviews/getreview/${productData.id}`); // Pass the correct ID
            if (response.ok) {
                const reviewData = await response.json()
                setReviews(reviewData)
            } else {
                console.error("Failed to fetch reviews:", response.statusText)
            }
        } catch (error) {
            console.error("Error fetching reviews:", error)
        }
    }

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0
        const totalRating = reviews.reduce((acc, review) => acc
            + review.rating, 0)
        return (totalRating / reviews.length).toFixed(1)
    }

    const averageRating = calculateAverageRating()


    const scrollToReviews = () => {
        if (reviewRef.current) {
            reviewRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    useEffect(() => {
        if (!productData.reviews) {
            // Only call handleSizeChange when productData is initialized
            handleSizeChange("50 ml");
        }
    }, [productData]);

    useEffect(() => {
        if (productData.id) {
            fetchReviews()
        }
    }, [productData.id])

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <div className="ml-4 mt-4 mx-4 flex flex-wrap items-center justify-between">
                <div className="flex flex-wrap text-sm md:text-base gap-3 md:gap-6 text-gray-500 font-secondary">
                    <span className="flex flex-wrap gap-2">
                        <Link to="/" className="hover:text-blue-500">
                            Home
                        </Link>
                        &gt;
                        <Link to="/micro-nutrients" className="hover:text-blue-500">
                            Buy Micro-nutrients Online
                        </Link>
                        &gt;
                        <span className="text-gray-700">{productData.name}</span>
                    </span>
                </div>

                {/* Next Button */}
                <button
                    onClick={fetchNextProduct}
                    className="mt-3 md:mt-0 font-secondary cursor-pointer hover:text-blue-500 text-sm md:text-base"
                >
                    Next &gt;
                </button>
            </div>


            <div className="flex flex-col lg:flex-row p-4 lg:p-2">
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
                    <h1 className="text-2xl font-bold text-[#1e2d7d]">{productData.name}</h1>
                    <div className="flex items-center mt-4 text-sm font-medium text-black">
                        <div className="flex">
                            {Array.from({ length: 5 }, (_, index) => (
                                <StarIcon
                                    key={index}
                                    color={index < Math.round(averageRating) ? "warning" : "disabled"}
                                />
                            ))}
                        </div>
                        <span className="ml-2">{averageRating}</span>
                        <span className="text-sm font-medium text-gray-600 ml-2 cursor-pointer hover:text-blue-500" onClick={scrollToReviews}>({reviews.length} reviews)</span>
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
                                {selectedSize === '50 ml' ? productData.price_small - productData.save : productData.salePrice - productData.save}
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
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-semibold">Quantity:</span>
                            <div className="flex items-center border-2 border-gray-300 rounded-md">
                                <button className="px-4 py-2 text-gray-400 hover:text-black border-r border-gray-300 transition-colors" onClick={handleDecrement}>-</button>
                                <span className="px-6 text-lg text-gray-700">{count}</span>
                                <button className="px-4 py-2 text-gray-400 hover:text-black border-l border-gray-300 transition-colors" onClick={handleIncrement}>+</button>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleBuyNow}
                                disabled={productData.stockStatus === "Out of Stock"}
                                className={`py-3 px-6 rounded font-bold transition-colors ${productData.stockStatus === "In Stock" ? "bg-blue-500 hover:bg-blue-700 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={productData.stockStatus === 'Out of Stock'}
                                className={`py-3 px-6 rounded font-bold transition-colors ${productData.stockStatus === 'In Stock'
                                    ? "bg-red-500 hover:bg-red-700 text-white"
                                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    }`}
                            >
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={reviewRef}>
                <Reviews reviews={reviews} authenticatedUser={authenticatedUser} productId={productData.id} fetchReviews={fetchReviews} />
            </div>

            {/* <Description productData={productData} /> */}
        </div>
    );
};

export default ShowMicroProduct;
