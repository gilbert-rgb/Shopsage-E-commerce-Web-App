import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const { cart = [] } = useContext(CartContext) || {};

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-blue-600 text-white px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          ShopApp
        </Link>

        <div className="space-x-4 flex items-center">
          <Link to="/products" className="hover:underline">
            Products
          </Link>

          <Link to="/cart" className="hover:underline">
            Cart ({totalItems})
          </Link>

          {currentUser ? (
            <>
              <Link to="/orders" className="hover:underline">
                Orders
              </Link>
              <Link to="/profile" className="hover:underline">
                Profile ({currentUser.is_admin ? "Admin" : "User"})
              </Link>

              {currentUser.is_admin && (
                <>
                  <Link to="/admin" className="hover:underline">
                    Admin Dashboard
                  </Link>
                  <Link to="/add-product" className="hover:underline text-yellow-300 font-semibold">
                    + Add Product
                  </Link>
                </>
              )}

              <button
                onClick={logout_user}
                className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
