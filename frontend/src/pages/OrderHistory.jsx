import React, { useEffect, useContext } from "react";
import { OrderContext } from "../contexts/OrderContext";
import { ProductContext } from "../contexts/ProductContext";

const OrderHistory = () => {
  const { orders, fetch_my_orders, delete_order, loadingOrders } = useContext(OrderContext);
  const { products } = useContext(ProductContext);

  useEffect(() => {
    fetch_my_orders();
  }, []);

  const handleCancel = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      delete_order(orderId);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {loadingOrders ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.order_id}
            className="border p-4 rounded shadow mb-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Order #{order.order_id}</h4>
              {order.status === "pending" && (
                <button
                  onClick={() => handleCancel(order.order_id)}
                  className="text-red-600 hover:underline"
                >
                  Cancel Order
                </button>
              )}
            </div>

            <p className="text-sm text-gray-600">
              Status:{" "}
              <span
                className={`font-semibold ${
                  order.status === "pending"
                    ? "text-yellow-600"
                    : order.status === "shipped"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {order.status}
              </span>{" "}
              | Date: {new Date(order.created_at).toLocaleString()}
            </p>

            <ul className="mt-2 pl-4 list-disc text-sm text-gray-800">
              {order.items.map((item, index) => (
                <li key={index}>
                  {getProductName(item.product_id)} – Qty: {item.quantity} – ${item.price_at_order}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
