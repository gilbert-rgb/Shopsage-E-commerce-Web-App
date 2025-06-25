// src/pages/CartPage.jsx
import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { OrderContext } from "../contexts/OrderContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; // ✅ using lucide icon

const CartPage = () => {
  const { cart, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const { place_order } = useContext(OrderContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    const orderItems = cart.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    place_order(orderItems);
    clearCart();
    toast.success("Order placed successfully!");
    setTimeout(() => navigate("/orders"), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-blue-600" />
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.product.id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">{item.product.name}</h4>
                  <p className="text-sm text-gray-500">
                    ${item.product.price} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <p className="text-xl font-semibold text-gray-700">
              Total: ${getCartTotal()}
            </p>
            <button
              onClick={handleCheckout}
              className="mt-3 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
