import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const MAX_ORDER_LIMIT = 10; // Maximum order limit per product

const ProductCard = ({ product }) => {
  const { cart, dispatch } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(""); // To store error messages

  const cartItem = cart.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (cartItem?.quantity >= MAX_ORDER_LIMIT) {
      showError(`Cannot order more than ${MAX_ORDER_LIMIT} items.`);
    } else {
      setIsEditing(true);
      dispatch({ type: "ADD_TO_CART", payload: { ...product, thumbnail: product.thumbnail } });
      setError(""); // Clear error when adding a valid quantity
    }
  };

  const handleIncrease = () => {
    if (cartItem.quantity >= MAX_ORDER_LIMIT) {
      showError(`Cannot order more than ${MAX_ORDER_LIMIT} items.`);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: product.id, quantity: cartItem.quantity + 1 },
      });
      setError(""); // Clear error on valid increase
    }
  };

  const handleDecrease = () => {
    if (cartItem.quantity > 1) {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: product.id, quantity: cartItem.quantity - 1 },
      });
      setError(""); // Clear error on valid decrease
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: { id: product.id } });
      setError(""); // Clear error when item is removed
    }
  };

  const handleDone = () => {
    dispatch({ type: "MARK_AS_DONE", payload: { id: product.id } });
    setIsEditing(false);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000); // Clear the error after 5 seconds
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-64 border border-gray-200">
      <div className="h-48 w-full bg-gray-100 rounded-md flex items-center justify-center mb-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-40 object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      {cartItem && isEditing ? (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleDecrease}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-gray-800 font-semibold">{cartItem.quantity}</span>
            <button
              onClick={handleIncrease}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
            >
              +
            </button>
          </div>
          <button
            onClick={handleDone}
            className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 transition-transform transform active:scale-95"
          >
            Done
          </button>
        </div>
      ) : cartItem?.isDone ? (
        <div className="mt-4 text-green-600 font-semibold">Added to Cart</div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-transform transform active:scale-95"
        >
          Add to Cart
        </button>
      )}
      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ProductCard;
