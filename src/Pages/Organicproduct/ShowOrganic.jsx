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
import { useAuth } from "../../actions/authContext";
import Reviews from "../Reviews";

const OrganicproductData = () => {
  const { getAuthToken, authenticatedUser } = useAuth()
  const history = useHistory();
  const location = useLocation();
  const initialProductData = (location.state && location.state.OrganicproductData) || {};
  const [productData, setProductData] = useState(initialProductData);
  const [count, setCount] = useState(1);
  const [cartData, setCartData] = useState(null);
  const [selectedSize, setSelectedSize] = useState('50 ml');
  const [reviews, setReviews] = useState([]);

  const fetchNextProduct = async () => {
    try {
      const response = await fetch(`/organicproduct/next/${productData.id}`);

      if (response.ok) {
        const nextProduct = await response.json()
        if (nextProduct) {
          history.push({
            pathname: `/organicproduct/${nextProduct.name}`,
            state: { OrganicproductData: nextProduct }
          });
          setProductData(nextProduct);
          setSelectedSize("50 ml"); // Reset the size to default
        } else {
          console.error("No more product available ")
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
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);

    // Prepare updated product data based on selected size
    const updatedData = {
      reviews: newSize === '50 ml' ? initialProductData.review_50 : initialProductData.review_100,
      save: newSize === '50 ml' ? initialProductData.save_50 : initialProductData.save_100,
      price: newSize === '50 ml' ? initialProductData.price_small : initialProductData.salePrice,
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
          productType: "organicproduct" // or any other product type

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
      history.push("/BuyNow", { productData: { ...productData, quantity: count, totalPrice: productData.price * count } })
    }
  }


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
      fetchReviews()
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
              to="/organicproduct"
            >
              Buy Organic Product Online         </Link>
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
            <p className="text-2xl font-semibold space-x-9 ">
              Quantity :
              <p className="text-4xl space-x-12 text-red-900 ml-32 overflow-hidden -mt-9 item-center border-[2px] border-t-2 border-b-2">
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
              </p>
            </p>
            <div className="flex justify-center content-center min-h-12">
              <span onClick={handleBuyNow} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 ml-12 -mt-2 rounded hover:cursor-pointer">
                Buy Now
              </span>
              <button onClick={handleAddToCart} className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 ml-4 -mt-2 rounded hover:cursor-pointer" >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Reviews reviews={reviews} authenticatedUser={authenticatedUser} productId={productData.id} fetchReviews={fetchReviews} />

      {/* <Description /> */}
    </div>
  );
};
export default OrganicproductData