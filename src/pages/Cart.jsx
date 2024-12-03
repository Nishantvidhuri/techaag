import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const MAX_ORDER_LIMIT = 10; // Maximum quantity limit

const Cart = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [quantityError, setQuantityError] = useState({});

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount =
    discountType === "fixed"
      ? discountValue
      : discountType === "percentage"
      ? (subtotal * discountValue) / 100
      : 0;

  const finalPrice = Math.max(subtotal - discountAmount, 0);

  const handleIncrease = (id, quantity) => {
    if (quantity < MAX_ORDER_LIMIT) {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: quantity + 1 },
      });
      setQuantityError((prev) => ({ ...prev, [id]: "" })); // Clear error
    } else {
      setQuantityError((prev) => ({
        ...prev,
        [id]: `Cannot order more than ${MAX_ORDER_LIMIT} items.`,
      }));
      setTimeout(() => {
        setQuantityError((prev) => ({ ...prev, [id]: "" })); // Clear error after 5 seconds
      }, 5000);
    }
  };

  const handleDecrease = (id, quantity) => {
    if (quantity > 1) {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: quantity - 1 },
      });
      setQuantityError((prev) => ({ ...prev, [id]: "" })); // Clear error
    } else {
      setQuantityError((prev) => ({
        ...prev,
        [id]: "Quantity must be at least 1.",
      }));
      setTimeout(() => {
        setQuantityError((prev) => ({ ...prev, [id]: "" })); // Clear error after 5 seconds
      }, 5000);
    }
  };

  const handleRemove = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
    setQuantityError((prev) => ({ ...prev, [id]: "" })); // Clear error
  };

  const handleApplyDiscount = () => {
    if (discountCode === "SAVE10") {
      setDiscountType("percentage");
      setDiscountValue(10);
      setDiscountError("");
    } else if (discountCode === "FLAT10") {
      setDiscountType("fixed");
      setDiscountValue(10);
      setDiscountError("");
    } else {
      setDiscountError("Invalid discount code. Try SAVE10 or FLAT10.");
      setDiscountType("");
      setDiscountValue(0);
    }
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      dispatch({ type: "CLEAR_CART" });
      navigate("/checkout");
    } else {
      alert("Your cart is empty. Add some items to proceed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-lg text-gray-600">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-20 w-20 object-contain"
              />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleDecrease(item.id, item.quantity)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  readOnly
                  className="mx-2 w-10 text-center border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => handleIncrease(item.id, item.quantity)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 font-bold hover:text-red-700"
              >
                Remove
              </button>
              {quantityError[item.id] && (
                <p className="text-red-500 text-sm mt-2">{quantityError[item.id]}</p>
              )}
            </div>
          ))}

          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cart Summary</h2>
            <p className="text-gray-700">
              Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
            </p>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <button
                onClick={handleApplyDiscount}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
            {discountError && (
              <p className="text-red-500 text-sm mt-2">{discountError}</p>
            )}
            {discountAmount > 0 && (
              <p className="mt-4 text-gray-700">
                Discount:{" "}
                <span className="font-bold text-green-600">
                  -${discountAmount.toFixed(2)}
                </span>
              </p>
            )}

            <p className="text-gray-700 mt-2">
              Final Price:{" "}
              <span className="font-bold text-gray-800">
                ${finalPrice.toFixed(2)}
              </span>
            </p>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
