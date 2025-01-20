import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const history = useHistory();

    const fetchCartData = async () => {
        try {
            const response = await fetch("/cart", {
                credentials: "include",
            });
            if (!response.ok) {
                if (response.status === 401) {
                    setIsAuthenticated(false);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const updatedData = data.map((item) => ({
                ...item,
                totalPrice: item.price * item.quantity //compute total Price
            }))
            setCartData(updatedData);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await fetch(`/cart/${itemId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                setCartData((prevData) =>
                    prevData.filter((item) => item.id !== itemId)
                );
            } else {
                console.error("Failed to remove item from cart");
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const calculateSubtotal = () => {
        return cartData.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto my-16 text-center max-w-lg px-6">
                <h2 className="text-4xl font-extrabold mb-6 text-gray-900">
                    Your Cart is Empty
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                    Please log in to access your cart items.
                </p>
                <button
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition"
                    onClick={() => history.push("/Signin")}
                >
                    Log In
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-16 max-w-5xl px-6">
            <h2 className="text-4xl font-extrabold mb-8 text-gray-900">
                Your Shopping Cart
            </h2>
            <p className="text-gray-700 text-sm mb-4">
                {cartData.length}{" "}
                {cartData.length === 1 ? "item" : "items"} in your cart
            </p>

            <ul className="space-y-6">
                {cartData.map((item) => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onDelete={handleRemoveFromCart}
                    />
                ))}
            </ul>

            <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <p className="text-xl font-semibold text-gray-900">
                    Subtotal:{" "}
                    <span className="text-indigo-600">
                        ${calculateSubtotal().toFixed(2)}
                    </span>
                </p>
                <Link
                    to={{
                        pathname: "/checkout",
                        state: { cartData },
                    }}
                    className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition"
                >
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
};

const CartItem = ({ item, onDelete }) => (
    <li className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-lg shadow-md border border-gray-200 transition hover:shadow-lg">
        <Link
            to={{
                pathname: `/cartproduct/${item.id}`,
                state: { Cartproduct: item },
            }}
            className="w-full sm:w-32 h-32 flex-shrink-0"
        >
            <img
                src={`data:image/avif;base64,${item.image}`}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
            />
        </Link>
        <div className="flex-1 mt-4 sm:mt-0 sm:ml-6">
            <Link
                to={{
                    pathname: `/cartproduct/${item.id}`,
                    state: { Cartproduct: item },
                }}
                className="text-lg font-semibold text-gray-800 hover:underline"
            >
                {item.name}
            </Link>
            <p className="text-gray-600 mt-2">Price: ${item.price}</p>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
        </div>
        <button
            className="mt-4 sm:mt-0 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => onDelete(item.id)}
        >
            Remove
        </button>
    </li>
);

export default Cart;
