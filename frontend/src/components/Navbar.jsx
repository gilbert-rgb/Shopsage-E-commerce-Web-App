import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const { cart = [] } = useContext(CartContext) || {};
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setIsOpen(false); // close mobile menu after clicking a link
  };

  const handleLogout = () => {
    logout_user();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="text-2xl font-bold tracking-tight hover:text-yellow-300"
        >
          🛍️ ShopSage
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Nav Links */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 text-sm sm:text-base font-medium w-full md:w-auto mt-4 md:mt-0`}
        >
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-3 md:space-y-0">
            <Link to="/products" onClick={handleLinkClick} className="hover:text-yellow-300">
              Products
            </Link>
            <Link to="/cart" onClick={handleLinkClick} className="hover:text-yellow-300 relative">
              Cart
              <span className="ml-1 bg-yellow-400 text-black font-semibold rounded-full px-2 py-0.5 text-xs">
                {totalItems}
              </span>
            </Link>
            {currentUser && (
              <Link to="/orders" onClick={handleLinkClick} className="hover:text-yellow-300">
                Orders
              </Link>
            )}
            {currentUser && (
              <Link to="/profile" onClick={handleLinkClick} className="hover:text-yellow-300 flex items-center gap-1">
                👤 {currentUser.username} ({currentUser.is_admin ? "Admin" : "User"})
              </Link>
            )}
            {currentUser?.is_admin && (
              <>
                <Link to="/admin" onClick={handleLinkClick} className="hover:text-yellow-300">
                  Dashboard
                </Link>
                <Link
                  to="/add-product"
                  onClick={handleLinkClick}
                  className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 font-semibold"
                >
                  + Add Product
                </Link>
              </>
            )}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={handleLinkClick} className="hover:text-yellow-300">
                  Login
                </Link>
                <Link to="/register" onClick={handleLinkClick} className="hover:text-yellow-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
