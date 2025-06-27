import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { ProductContext } from '../contexts/ProductContext';
import { CartContext } from '../contexts/CartContext';
import { OrderContext } from '../contexts/OrderContext';
import { toast } from 'react-toastify';

const landingImage = "https://cdn4.vectorstock.com/i/1000x1000/51/13/shopping-cart-logo-icon-e-commerce-bag-vector-39835113.jpg";

const Home = () => {
  const { currentUser } = useContext(UserContext);
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { place_order } = useContext(OrderContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [featured, setFeatured] = useState(null);

  const navigate = useNavigate();

  // Pick a random in-stock product
  useEffect(() => {
    if (products && products.length > 0) {
      const inStockProducts = products.filter(p => p.stock > 0);
      if (inStockProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * inStockProducts.length);
        setFeatured(inStockProducts[randomIndex]);
      }
    }
  }, [products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error("Please login to add to cart");
      return;
    }
    addToCart(featured, Number(quantity));
    toast.success("Added to cart!");
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      toast.error("Please login to buy");
      return;
    }

    if (quantity <= 0 || quantity > featured.stock) {
      toast.error("Invalid quantity");
      return;
    }

    try {
      await place_order([{ product_id: featured.id, quantity: Number(quantity) }]);
      toast.success("Order placed!");
      navigate("/orders");
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    }
  };

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

          {/* 🔍 Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto md:mx-0">
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-r-lg hover:bg-sky-700 transition duration-300"
              >
                Search
              </button>
            </div>
          </form>

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

          {!currentUser && (
            <p className="mt-6 text-sm text-gray-600">
              <span className="font-medium">Note:</span> Please{" "}
              <Link to="/login" className="text-blue-600 underline">login</Link> or{" "}
              <Link to="/register" className="text-blue-600 underline">register</Link> to place orders.
            </p>
          )}

          {/* 🎯 Featured Product Section */}
          {featured && (
            <div className="mt-10 border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Featured Product</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={featured.image || "https://via.placeholder.com/300"}
                  alt={featured.name}
                  className="w-40 h-40 object-cover rounded-lg shadow-md border"
                />
                <div>
                  <h4 className="text-xl font-semibold">{featured.name}</h4>
                  <p className="text-gray-600">{featured.description}</p>
                  <p className="font-bold text-blue-600 mt-1">${featured.price}</p>
                  <p className="text-sm text-gray-500">In stock: {featured.stock}</p>

                  <div className="flex items-center mt-4 gap-2">
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      max={featured.stock}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="border px-2 py-1 w-20 rounded"
                    />
                    <button
                      onClick={handleAddToCart}
                      disabled={!currentUser || featured.stock <= 0}
                      className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={!currentUser || featured.stock <= 0}
                      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Landing Image */}
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
