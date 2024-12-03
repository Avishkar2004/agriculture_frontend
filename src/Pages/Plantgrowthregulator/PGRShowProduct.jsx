import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import TwitterIcon from "@mui/icons-material/Twitter";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useHistory } from 'react-router-dom';
import Description from '../Description';
import { useAuth } from '../../actions/authContext';
import { Box, Button, Modal, TextField } from "@mui/material";

const PGRShowProduct = () => {
  const { getAuthToken, authenticatedUser } = useAuth() || {};
  const history = useHistory();
  const location = useLocation();
  const initialproductData = (location.state && location.state.PGRProduct) || {};
  const [productData, setProductData] = useState(initialproductData);
  const [count, setCount] = useState(1);
  const [cartData, setCartData] = useState(null);
  const [selectedSize, setSelectedSize] = useState('50 ml');
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ username: '', rating: 0, comment: '' });

  const toggleReviewModal = () => {
    setIsReviewModalOpen(!isReviewModalOpen)
    if (!isReviewModalOpen) {
      setNewReview({
        username: authenticatedUser ? authenticatedUser.username : "",
        rating: 0,
        comment: ""
      })
    }
  }

  const fetchNextProduct = async () => {
    try {
      const response = await fetch(`/plantgrowthregulator/next/${productData.id}`);
      if (response.ok) {
        const nextProduct = await response.json();

        if (nextProduct) {
          // Update the state with the next product's data
          history.push({
            pathname: `/plantgrowthregulator/${nextProduct.name}`,
            state: { PGRProduct: nextProduct }
          });
          setProductData(nextProduct);
          setSelectedSize("50 ml"); // Reset the size to default
        } else {
          console.error("No more products available");
        }
      } else {
        console.error('Failed to fetch the next product');
      }
    } catch (error) {
      console.error('Error fetching next product:', error);
    }
  };
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);

    // Prepare updated product data based on selected size
    const updatedData = {

      reviews: newSize === '50 ml' ? initialproductData.review_50 : initialproductData.review_100,
      save: newSize === '50 ml' ? initialproductData.save_50 : initialproductData.save_100,
      price: newSize === '50 ml' ? initialproductData.price_small : initialproductData.salePrice,
    };

    // Update the productData state with the new values
    setProductData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
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
      history.push("/BuyNow", { productData: { ...productData, quantity: count, totalPrice: productData.price * count } });
    }
  };



  const handleReviewSubmit = async () => {
    try {
      const response = await fetch('/api/reviews/addreviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productData.id,
          user_id: authenticatedUser.id,
          username: authenticatedUser.username,
          rating: newReview.rating,
          comment: newReview.comment,
          ...newReview
        }),
      });
      if (response.ok) {
        const createdReview = await response.json();
        setReviews((prev) => [...prev, createdReview]); // Append the new review
        toggleReviewModal();
        setNewReview({ username: '', rating: 0, comment: '' });
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const fetchReviews = async () => {
    if (!productData.id) return; // Ensure the product ID exists before fetching reviews
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
  

  useEffect(() => {
    if (!productData.reviews) {
      // Only call handleSizeChange when productData is initialized
      handleSizeChange("50 ml");
    }
  }, [productData]);

  useEffect(() => {
    if (productData.id) {
      fetchReviews();
    }
  }, [productData.id])

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="space-x-52 ml-12 mt-4 mb-4">
        <div className="flex text-sm gap-12 text-gray-500 font-secondary">
          <span className="space-x-2 ml-6">
            <Link to="/" className="hover:text-blue-500" >
              Home
            </Link>
            &gt;
            <Link
              className="hover:text-blue-500 text-sm"
              to="/plantgrowthregulator"
            >
              Plant Growth Regulator (PGR)
            </Link>
            &gt;
            <span className="text-sm">{productData.name}</span>
          </span>
          <button onClick={fetchNextProduct} className="right-12 absolute font-secondary cursor-pointer hover:text-blue-500 text-base">
            Next &gt;
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left Side */}
        <div className="w-1/2 bg-white text-center ml-12 border-r-2 border-l-2 border-t-2 border-b-2">
          <img
            className="h-28 border-2 border-blue-500"
            src={`data:image/avif;base64, ${productData.image}`}
            alt={productData.name}
          />
          {/* this is a big image */}
          <img
            src={`data:image/avif;base64,${productData.image}`}
            alt={productData.name}
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
          <h1 className="text-2xl font-[#1e2d7d]">{productData.name}</h1>
          <p className="mt-5 mb-3">
            <StarIcon color="warning" />
            <StarIcon color="warning" />
            <StarIcon color="warning" />
            <StarIcon color="warning" />
            <StarIcon color="warning" /> {reviews.length} reviews
          </p>
          <span className="bg-green-300">Save {productData.save}</span>
          <div className="flex mt-3 mb-3">
            <p className="text-lg font-semibold text-gray-800">
              <span className="text-blue-600">{productData.brands}</span>
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
              {productData.small_50}
            </button>
            <button
              className={`text-xl border-2 rounded-md py-1 px-3 focus:outline-none ${selectedSize === '100 ml' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-700 border-gray-300'}`}
              onClick={() => handleSizeChange('100 ml')}
            >
              {productData.big_100}
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
                  {/* Calculate the displayed price based on selected size and current productData */}
                  {selectedSize === '50 ml'
                    ? productData.price_small - productData.save
                    : productData.salePrice - productData.save}
                </span>
                {/* Show the original price with a strikethrough if there is a discount */}
                {selectedSize === '50 ml' && productData.price_small ? (
                  <span className="text-base text-gray-700 line-through ml-3">
                    {productData.price_small}
                  </span>
                ) : selectedSize === '100 ml' && productData.salePrice ? (
                  <span className="text-base text-gray-700 line-through ml-3">
                    {productData.salePrice}
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
              <Link to="/#" onClick={handleBuyNow} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 ml-12 -mt-2 rounded">
                Buy Now
              </Link>
              <button onClick={handleAddToCart} className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 ml-4 -mt-2 rounded hover:cursor-pointer">
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 mt-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-900">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="mt-6 space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{review.username}</h3>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <StarIcon key={i} className="text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
        )}
        <button
          onClick={toggleReviewModal}
          className="mt-6 w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Write a Review
        </button>
      </div>

      {/* Review Modal */}
      <Modal open={isReviewModalOpen} onClose={toggleReviewModal}>
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Write a Review</h2>
          <p className="mb-4 text-gray-600">
            {authenticatedUser ? (
              <span className="font-medium">{authenticatedUser.username}</span>
            ) : (
              <span>
                <Link to="/Signup" className="text-blue-600 hover:underline">Sign up</Link> or
                <Link to="/Signin" className="ml-2 text-blue-600 hover:underline">Sign in</Link>
              </span>
            )}
          </p>
          <TextField
            label="Rating (1-5)"
            type="number"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, rating: Number(e.target.value) }))
            }
            inputProps={{ min: 1, max: 5 }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Comment"
            multiline
            rows={4}
            value={newReview.comment}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, comment: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <div className="flex justify-between mt-6">
            <Button
              variant="contained"
              color="primary"
              onClick={handleReviewSubmit}
              disabled={!newReview.rating || !newReview.comment}
            >
              Submit Review
            </Button>
            <Button variant="outlined" color="secondary" onClick={toggleReviewModal}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>


      <Description />
    </div>
  );
};

export default PGRShowProduct;
