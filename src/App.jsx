import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductListing from "./pages/ProductListing";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout"; // Import Checkout page
import { CartProvider, useCart } from "./context/CartContext";

const Header = () => {
  const { cart } = useCart(); // Access the cart from CartContext

  // Count unique items in the cart
  const uniqueItemsCount = cart.length;

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-600">
          MyShop
        </Link>
        <div className="relative">
          <Link
            to="/cart"
            className="text-lg font-semibold text-gray-700 hover:text-blue-500"
          >
            Cart
          </Link>
          <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {uniqueItemsCount}
          </span>
        </div>
      </nav>
    </header>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<ProductListing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} /> {/* Checkout page */}
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
};

export default App;
