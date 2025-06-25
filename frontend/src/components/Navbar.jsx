import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);

  return (
    <nav className="bg-blue-600 text-white px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          ShopApp
        </Link>

        <div className="space-x-4 flex items-center">
          {currentUser ? (
            <>
              <Link to="/add-product" className="hover:underline">
                Add Product
              </Link>

              <Link to="/profile" className="hover:underline flex items-center space-x-1">
                <span>Profile</span>
                <span
                  className={`font-semibold ${
                    currentUser.is_admin ? "text-green-300" : "text-gray-300"
                  }`}
                >
                  ({currentUser.is_admin ? "Admin" : "User"})
                </span>
              </Link>

              {currentUser.is_admin && (
                <Link to="/admin" className="hover:underline">
                  Admin Dashboard
                </Link>
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
