import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from "@mui/icons-material/Close";
import SellIcon from '@mui/icons-material/Sell';

import MenuIcon from "@mui/icons-material/Menu";
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from "react-router-dom";
import { useAuth } from "../actions/authContext";
import HeaderPhoto from './Logo.webp';

const Header = () => {
  const inputRef = useRef(null);
  const { authenticatedUser, logout } = useAuth() || {};
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const fetchCartData = async () => {
    try {
      const response = await fetch('/cart', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCartItemCount(data.length);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const handleSearch = async (query) => {
    if (query.length > 2) {
      try {
        const response = await fetch(`/search?q=${query}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const ProfilehandleLogOut = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      logout();
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

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
              to="/help"
              className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-blue-100 transition duration-200 rounded-md"
              onClick={closeDropdown}
            >
              <AccountCircleIcon className="text-blue-500" />
              <span className="font-medium">Help Center</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-6 py-3 w-full text-gray-800 hover:bg-red-100 transition duration-200 rounded-md"
            >
              <ExitToAppIcon className="text-red-500" />
              <span className="font-medium text-red-600">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/Signup" className="text-gray-700 hover:text-gray-900">Sign up</Link>
            <Link to="/Signin" className="text-gray-700 hover:text-gray-900">Sign in</Link>
          </>
        )}
        <Link to="/#" className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-indigo-100 transition duration-200 rounded-md">
          <SellIcon className="text-green-500" />
          Be a Seller</Link>
      </div>
    </div>
  );

  const renderUserDropdown = () => (
    <div className="relative inline-block text-left">
      <div
        className="flex items-center gap-2 cursor-pointer py-2 px-3 bg-gray-50 rounded-lg shadow hover:bg-gray-200 transition duration-300"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {authenticatedUser?.avatar ? (
          <img
            src={authenticatedUser.avatar}
            alt={authenticatedUser.username || "User"}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <AccountCircleIcon className="text-gray-700 w-8 h-8" />
        )}
        <span className="text-gray-900 font-semibold">{authenticatedUser?.username || "Guest"}</span>
        {isDropdownOpen ? (
          <KeyboardArrowUpIcon className="text-gray-700" />
        ) : (
          <KeyboardArrowDownIcon className="text-gray-700" />
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
            onClick={closeDropdown}
          >
            <AccountCircleIcon className="text-indigo-500" />
            My Profile
          </Link>
          <Link
            to="/orders"
            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
            onClick={closeDropdown}
          >
            <ListAltIcon className="text-green-500" />
            My Orders
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
            onClick={closeDropdown}
          >
            <AccountCircleIcon className="text-yellow-500" />
            Settings
          </Link>
          <Link
            to="/help"
            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
            onClick={closeDropdown}
          >
            <AccountCircleIcon className="text-blue-500" />
            Help Center
          </Link>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                ProfilehandleLogOut();
              }
            }}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
          >
            <ExitToAppIcon className="text-red-500" />
            Logout
          </button>
        </div>
      )}
    </div>

  );

  return (
    <header className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 text-2xl font-bold">
          <img src={HeaderPhoto} alt="Header" className="w-14 h-auto rounded-lg" />
        </Link>
        <div className="flex-grow max-w-3xl mx-4 relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full px-5 py-3 text-gray-800 bg-white border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search products, categories..."
            value={searchQuery}
            onChange={handleInputChange}
          />
          <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 cursor-pointer" />
        </div>
        <div className="flex items-center space-x-4">
          {authenticatedUser ? (
            renderUserDropdown()
          ) : (
            <div className="space-x-4">
              <Link to="/Signup" className="hover:underline">Sign up</Link>
              <Link to="/Signin" className="hover:underline">Sign in</Link>
            </div>
          )}
          <Link to="/#" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full hover:bg-yellow-500 transition">
            Become a Seller
          </Link>
          <Link to="/cart" className="relative text-white flex items-center">
            <ShoppingCartOutlinedIcon className="h-6 w-6" />
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
              {cartItemCount}
            </span>
          </Link>
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Sidebar for small screens */}
      {renderSidebar()}

      {searchResults.length > 0 ? (
        <div className="container mx-auto mt-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-800 text-xl mb-4 font-semibold">Search Results:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((product) => (
              <div key={product.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-lg transition duration-300">
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold text-gray-900 mt-2">{product.name}</h3>
                <p className="text-gray-700">{product.description}</p>
                <p className="text-indigo-600 font-bold">Price: ${product.salePrice}</p>
              </div>
            ))}
          </div>
        </div>
      ) : searchQuery.length > 2 && (
        <div className="container mx-auto mt-4 bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-lg text-center">
          <h3 className="text-gray-700 text-lg">No results found</h3>
        </div>
      )}
    </header>
  );
};

export default Header;
