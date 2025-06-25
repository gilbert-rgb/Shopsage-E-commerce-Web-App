import { useContext, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import { OrderContext } from "../contexts/OrderContext";
import { CartContext } from "../contexts/CartContext";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import ReviewSection from "../components/ReviewSection";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");

  const { products } = useContext(ProductContext);
  const { place_order } = useContext(OrderContext);
  const { addToCart } = useContext(CartContext);
  const { currentUser } = useContext(UserContext);

  const [quantity, setQuantity] = useState(1);

  const productId = parseInt(id);
  const product = products.find((p) => p.id === productId);
  if (!product) return <p className="p-4">Loading product...</p>;

  const productIds = products.map((p) => p.id).sort((a, b) => a - b);
  const currentIndex = productIds.indexOf(productId);
  const prevId = productIds[currentIndex - 1];
  const nextId = productIds[currentIndex + 1];

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error("Please login to add to cart");
      return;
    }
    addToCart(product, parseInt(quantity));
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      toast.error("Please login to buy");
      return;
    }

    if (quantity <= 0 || quantity > product.stock) {
      toast.error("Please enter a valid quantity");
      return;
    }

    place_order([{ product_id: product.id, quantity: parseInt(quantity) }]);
    toast.success("Order placed!");
    setTimeout(() => navigate("/orders"), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <img
            src={product.image || "https://via.placeholder.com/500x500"}
            alt={product.name}
            className="w-full max-h-[400px] object-cover rounded-md border"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-blue-600 mb-1">${product.price}</p>
          <p className="text-sm text-gray-500 mb-4">In stock: {product.stock}</p>

          <div className="flex items-center space-x-3 mb-6">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border px-2 py-1 w-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddToCart}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              disabled={!currentUser || product.stock <= 0}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              disabled={!currentUser || product.stock <= 0}
            >
              Buy Now
            </button>
          </div>

          {!currentUser && (
            <p className="text-sm text-gray-600">
              Please{" "}
              <Link to="/login" className="text-blue-500 underline">
                login
              </Link>{" "}
              or{" "}
              <Link to="/register" className="text-blue-500 underline">
                register
              </Link>{" "}
              to place an order.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(`/products/${prevId}${search ? `?search=${search}` : ""}`)}
          disabled={prevId === undefined}
          className={`px-4 py-2 rounded ${
            prevId
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          ← Previous
        </button>

        <button
          onClick={() => navigate(`/products/${nextId}${search ? `?search=${search}` : ""}`)}
          disabled={nextId === undefined}
          className={`px-4 py-2 rounded ${
            nextId
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>

      <div className="mt-10">
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
