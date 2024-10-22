import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory if you're using React Router

const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume user is authenticated initially
    const history = useHistory();

    const fetchCartData = async () => {
        try {
            const response = await fetch("http://localhost:8080/cart", {
                credentials: "include" // Ensures cookies are sent with request
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // User is not authenticated
                    setIsAuthenticated(false);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCartData(data);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:8080/cart/${itemId}`, {
                method: "DELETE",
                credentials: "include" // Ensures cookies are sent with request
            });

            if (response.ok) {
                setCartData((prevData) => prevData.filter((item) => item.id !== itemId));
            } else {
                console.error("Failed to remove item from cart");
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const calculateSubtotal = () => {
        if (cartData.length === 0) {
            return 0;
        }
        return cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    useEffect(() => {
        const subtotal = calculateSubtotal();
        // Update subtotal state if necessary
    }, [cartData]);

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto my-8 text-center">
                <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
                <p className="text-lg text-gray-600 mb-4">
                    Missing cart items? Please log in to see the items you added previously.
                </p>
                <button
                    className="mt-4 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
                    onClick={() => history.push('/Signin')} // Redirect to login page
                >
                    Log In
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-8">
            <h2 className="text-3xl font-bold mb-6">Your Shopping Cart</h2>

            <p className="text-sm text-gray-600 mb-4">
                {cartData.length} {cartData.length === 1 ? 'item' : 'items'} in your cart
            </p>

            <ul className="grid gap-8 cursor-pointer">
                {cartData.map(item => (
                    <CartItem key={item.id} item={item} onDelete={handleRemoveFromCart} />
                ))}
            </ul>

            <div className="mt-8 border-t pt-6">
                <p className="text-xl font-bold">Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                <button className="mt-4 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

const CartItem = ({ item, onDelete }) => (
    <li className="flex bg-white p-4 rounded-lg shadow-md">
        <div className="flex-shrink-0">
            <img
                src={`data:image/avif;base64,${item.image}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
            />
        </div>
        <div className="flex-1 ml-4">
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-gray-600">Price: ${item.price}</p>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
        </div>
        <button
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => onDelete(item.id)}
        >
            Delete
        </button>
    </li>
);

export default Cart;
