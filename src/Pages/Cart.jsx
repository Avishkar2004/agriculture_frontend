import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const history = useHistory();

    const fetchCartData = async () => {
        try {
            const response = await fetch("/cart", {
                credentials: "include"
            });

            if (!response.ok) {
                if (response.status === 401) {
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
            const response = await fetch(`/cart/${itemId}`, {
                method: "DELETE",
                credentials: "include"
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

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto my-8 text-center max-w-lg px-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>
                <p className="text-lg text-gray-600 mb-4">
                    Missing cart items? Please log in to see the items you added previously.
                </p>
                <button
                    className="mt-4 bg-indigo-500 text-white px-6 py-3 rounded hover:bg-indigo-600"
                    onClick={() => history.push('/Signin')}
                >
                    Log In
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-8 max-w-4xl px-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h2>

            <p className="text-sm text-gray-600 mb-4">
                {cartData.length} {cartData.length === 1 ? 'item' : 'items'} in your cart
            </p>

            <ul className="space-y-4">
                {cartData.map(item => (
                    <CartItem key={item.id} item={item} onDelete={handleRemoveFromCart} />
                ))}
            </ul>

            <div className="mt-8 border-t pt-6 flex justify-between items-center">
                <p className="text-xl font-bold text-gray-800">Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                <Link to={{
                    pathname: "/checkout",
                    state: { cartData }
                }} className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600">
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
};

const CartItem = ({ item, onDelete }) => (
    <li className="flex flex-col md:flex-row items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <Link to={{
            pathname: `/product/${item.name}`,
            state: { product: item }
        }}>
            <div className="w-full md:w-24 h-24 flex-shrink-0">
                <img
                    src={`data:image/avif;base64,${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
        </Link>
        <div className="flex-1 mt-4 md:mt-0 md:ml-4">
            <Link to={{
                pathname: `/product/${item.name}`,
                state: { product: item }
            }} className="text-lg font-semibold to-gray-800">
                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
            </Link>
            <p className="text-gray-600">Price: ${item.price}</p>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
        </div>
        <button
            className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={() => onDelete(item.id)}
        >
            Delete
        </button>
    </li>
);

export default Cart;
