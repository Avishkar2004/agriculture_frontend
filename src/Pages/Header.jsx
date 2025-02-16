import {
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
  ExitToApp as ExitToAppIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ListAlt as ListAltIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Sell as SellIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../actions/authContext";
import HeaderPhoto from "./Logo.webp";

const Header = () => {
  const inputRef = useRef(null);
  const { authenticatedUser, logout } = useAuth() || {};
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimeout = useRef(null)

  useEffect(() => {
    // Fetch cart data on mount
    const fetchCartData = async () => {
      try {
        const response = await fetch("/cart", { method: "GET", credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setCartItemCount(data.length);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, []);

  const handleSearch = async (query) => {
    if (query.length > 1) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/search?q=${query}`, { method: "GET", credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          setError("Failed to fetch search results.");
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };


  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // handleSearch(query);

    // Clear previous debouce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set new debounce timeout
    debounceTimeout.current = setTimeout(() => {
      handleSearch(query)
    }, 400)
  };

  const ProfilehandleLogOut = async () => {
    try {
      const response = await fetch("/logout", { method: "POST", credentials: "include" })
      if (response.ok) {
        logout()
        window.location.reload()
      }
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const renderSidebar = () => (
    <div className={`fixed top-0 left-0 h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        onClick={toggleSidebar}
      >
        <CloseIcon />
      </button>
      <div className="mt-20 flex flex-col space-y-4 px-8">
        {authenticatedUser ? (
          <>
            {/* My Profile Link */}
            <Link
              to="/profile"
              className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-indigo-100 transition duration-200 rounded-md"
              onClick={closeDropdown}
            >
              <AccountCircleIcon className="text-indigo-500" />
              <span className="font-medium">My Profile</span>
            </Link>

            {/* My Orders Link */}
            <Link
              to="/orders"
              className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-green-100 transition duration-200 rounded-md"
              onClick={closeDropdown}
            >
              <ListAltIcon className="text-green-500" />
              <span className="font-medium">My Orders</span>
            </Link>
            {/* Settings Link */}
            <Link
              to="/settings"
              className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-yellow-100 transition duration-200 rounded-md"
              onClick={closeDropdown}
            >
              <AccountCircleIcon className="text-yellow-500" />
              <span className="font-medium">Settings</span>
            </Link>

            {/* Help Center Link */}
            <Link
              to="/helpcenter"
              className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-blue-100 transition duration-200 rounded-md"
              onClick={closeDropdown}
            >
              <AccountCircleIcon className="text-blue-500" />
              <span className="font-medium">Help Center</span>
            </Link>

            {/* My Order Button */}
            <Link to="/orders" className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-green-100 transition duration-200 rounded-md">
              <SellIcon className="text-green-500" />
              <span className="font-medium">My Orders</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  ProfilehandleLogOut();
                }
              }}
              className="flex items-center w-full text-left px-4 py-3 gap-3 hover:bg-red-100 text-gray-700 transition duration-200"
            >
              <ExitToAppIcon className="text-red-500 text-lg" />
              <span className="font-medium">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/Signup" className="text-gray-700 hover:text-gray-900">Sign up</Link>
            <Link to="/Signin" className="text-gray-700 hover:text-gray-900">Sign in</Link>
          </>
        )}

      </div>
    </div>
  );
  return (
    <header className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 text-lg md:text-2xl font-bold">
          <img src={HeaderPhoto} alt="Header" className="w-12 md:w-14 h-auto rounded-lg" />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow max-w-lg mx-4 relative text-black">
          <div className="relative w-full">
            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition shadow-sm placeholder-gray-500"
              placeholder="🔍 Search for products, categories..."
              value={searchQuery}
              onChange={handleInputChange}
            />
            {/* Search Icon */}
            <SearchIcon
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer transition"
              onClick={handleSearch}
            />
          </div>

          {/* Search Suggestions */}
          {searchQuery.length > 1 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-50">
              {/* Loading State */}
              {isLoading && (
                <p className="text-gray-500 text-center py-2 animate-pulse">
                  Searching for products...
                </p>
              )}
              {/* Display Results */}
              {!isLoading && searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/searchproduct/${product.id}`}
                    className="flex items-center gap-4 px-4 py-2 hover:bg-indigo-50 transition cursor-pointer"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.name}
                      className="w-10 h-10 object-contain bg-gray-100 rounded"
                    />
                    <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
                  </Link>
                ))
              ) : (
                // No Results or Error
                <p className="text-gray-500 text-center py-2">
                  {error ? (
                    <span className="text-red-500">Error: {error}</span>
                  ) : (
                    "No matching products found. Try different keywords."
                  )}
                </p>
              )}
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Become a Seller Button */}
          {authenticatedUser && (
            <Link
              to="#"
              className="hidden md:flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 shadow-md"
            >
              <SellIcon className="mr-2" />
              Become a Seller
            </Link>
          )}
          {/* Authenticated User Dropdown */}
          {authenticatedUser ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md focus:outline-none transition duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {authenticatedUser.avatar ? (
                  <img src={authenticatedUser?.avatar}
                    alt={authenticatedUser.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <AccountCircleIcon className="w-8 h-8 text-white" />
                )}
                <span className="text-sm font-medium">
                  {authenticatedUser.username}
                </span>
                {isDropdownOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 bg-white text-gray-800 w-56 mt-2 rounded-lg shadow-lg overflow-hidden">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-100 transition duration-200 text-gray-700"
                    onClick={closeDropdown}
                    ref={inputRef}
                  >
                    {authenticatedUser.avatar ? (
                      <img
                        src={authenticatedUser.avatar}
                        alt={authenticatedUser.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <AccountCircleIcon className="w-8 h-8 text-blue-600" />
                    )}
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-3 gap-3 hover:bg-green-100 text-gray-700 transition duration-200"
                    onClick={closeDropdown}
                  >
                    <ListAltIcon className="text-green-500 text-lg" />

                    <span className="font-medium">My Orders</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-3 gap-3 hover:bg-yellow-100 text-gray-700 transition duration-200"
                    onClick={closeDropdown}
                  >
                    <AccountCircleIcon className="text-yellow-500 text-lg" />

                    <span className="font-medium">Settings</span>

                  </Link>
                  <Link
                    to="/helpcenter"
                    className="flex items-center px-4 py-3 gap-3 hover:bg-blue-100 text-gray-700 transition duration-200"
                    onClick={closeDropdown}
                  >
                    <AccountCircleIcon className="text-blue-500 text-lg" />
                    <span className="font-medium"> Help Center</span>
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to logout?")) {
                        ProfilehandleLogOut();
                      }
                    }}
                    className="flex items-center w-full text-left px-4 py-3 gap-3 hover:bg-red-100 text-gray-700 transition duration-200"
                  >
                    <ExitToAppIcon className="text-red-500 text-lg" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/Signup" className="text-white hover:underline">
                Sign up
              </Link>
              <Link to="/Signin" className="text-white hover:underline">
                Sign in
              </Link>
            </>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-white hover:text-gray-300 transition-all duration-300"
          >
            <ShoppingCartOutlinedIcon className="text-2xl" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-2 py-1">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Sidebar Toggle */}
          <button
            className="md:hidden text-white hover:text-gray-300 transition-all duration-300"
            onClick={toggleSidebar}
          >
            <MenuIcon className="text-2xl" />
          </button>
        </div>
      </div>
      {/* Sidebar */}
      {renderSidebar()}
    </header >
  );
};

export default Header;
