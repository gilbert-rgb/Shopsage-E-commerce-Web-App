import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const landingImage = "https://cdn4.vectorstock.com/i/1000x1000/51/13/shopping-cart-logo-icon-e-commerce-bag-vector-39835113.jpg";

const Home = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="bg-gray-100 flex items-center justify-center p-8 min-h-screen">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight">
            Welcome to
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold text-sky-600 mt-2">
            ShopSage E-Commerce
          </h2>
          <p className="mt-6 text-xl text-gray-700 max-w-xl mx-auto md:mx-0">
            Discover amazing products, manage your store, and enjoy a seamless shopping experience powered by modern tech.
          </p>

          <div className="mt-8 space-x-4">
            <Link to="/products">
              <button className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition duration-300">
                Shop Now
              </button>
            </Link>

            {currentUser && !currentUser.is_admin && (
              <Link to="/orders">
                <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300">
                  View My Orders
                </button>
              </Link>
            )}
          </div>

          {/* Show message if user is not logged in */}
          {!currentUser && (
            <p className="mt-6 text-sm text-gray-600">
              <span className="font-medium">Note:</span> Please{" "}
              <Link to="/login" className="text-blue-600 underline">login</Link> or{" "}
              <Link to="/register" className="text-blue-600 underline">register</Link> to place orders.
            </p>
          )}
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2">
          <img 
            src={landingImage} 
            alt="ShopSage E-Commerce" 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
