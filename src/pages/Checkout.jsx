import React from "react";
import { Link } from "react-router-dom";

const Checkout = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Thank You for Your Purchase!
      </h1>
      <p className="text-lg text-gray-600">
        Your order has been placed successfully. We will send you a confirmation
        email shortly.
      </p>
      <p className="text-lg text-gray-600 mt-4">
        If you have any questions, feel free to contact our support team.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default Checkout;
