import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import { OrderContext } from "../contexts/OrderContext";
import { CartContext } from "../contexts/CartContext";
import { UserContext } from "../contexts/UserContext"; // ✅ Add this
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  const { place_order } = useContext(OrderContext);
  const { addToCart } = useContext(CartContext);
  const { currentUser } = useContext(UserContext); // ✅ Get user
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === parseInt(id));
  if (!product) return <p className="p-4">Loading product...</p>;

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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <img
        src={product.image || "https://via.placeholder.com/300"}
        alt={product.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-semibold text-blue-600">${product.price}</p>
      <p className="text-gray-500 mb-2">In stock: {product.stock}</p>

      <div className="flex items-center space-x-3 mt-4">
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border px-2 py-1 w-20 rounded"
        />
        <button
          onClick={handleAddToCart}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          disabled={!currentUser || product.stock <= 0}
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={!currentUser || product.stock <= 0}
        >
          Buy Now
        </button>
      </div>

      {!currentUser && (
        <p className="text-sm text-gray-600 mt-4">
          Please <Link to="/login" className="text-blue-500 underline">login</Link> or{" "}
          <Link to="/register" className="text-blue-500 underline">register</Link> to place an order.
        </p>
      )}
    </div>
  );
};

export default ProductDetail;
