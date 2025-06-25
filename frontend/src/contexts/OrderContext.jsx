// contexts/OrderContext.jsx
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import config from "../config.json";
import { UserContext } from "./UserContext";

const api_url = config.api_url;

// ✅ Named export for the context
export const OrderContext = createContext();

// ✅ Named export for the provider
export const OrderProvider = ({ children }) => {
  const { auth_token, currentUser, logout_user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 1. Place an Order
  const place_order = (items) => {
    toast.loading("Placing order...");
    fetch(`${api_url}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ items }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.dismiss();
        if (data.error) return toast.error(data.error);
        toast.success(data.success || "Order placed!");
        fetch_my_orders();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to place order.");
      });
  };

  // 2. Fetch My Orders
  const fetch_my_orders = () => {
    if (!auth_token || !currentUser) return;
    setLoadingOrders(true);
    fetch(`${api_url}/orders/${currentUser.id}`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 422) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setOrders(data || []))
      .catch((err) => {
        toast.error(err.message || "Failed to fetch your orders.");
        logout_user();
      })
      .finally(() => setLoadingOrders(false));
  };

  // 3. Fetch Orders for a Product
  const fetch_product_orders = (productId, callback) => {
    fetch(`${api_url}/orders/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => callback(data))
      .catch(() => {
        toast.error("Failed to fetch product orders.");
        callback([]);
      });
  };

  // 4. Update an Order
  const update_order = (orderId, status) => {
    toast.loading("Updating order...");
    fetch(`${api_url}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.dismiss();
        data.error ? toast.error(data.error) : toast.success(data.success);
        fetch_my_orders();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to update order.");
      });
  };

  // 5. Delete an Order
  const delete_order = (orderId) => {
    toast.loading("Deleting order...");
    fetch(`${api_url}/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.dismiss();
        data.error ? toast.error(data.error) : toast.success(data.success);
        fetch_my_orders();
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Failed to delete order.");
      });
  };

  const context_data = {
    orders,
    loadingOrders,
    place_order,
    fetch_my_orders,
    fetch_product_orders,
    update_order,
    delete_order,
  };

  return (
    <OrderContext.Provider value={context_data}>
      {children}
    </OrderContext.Provider>
  );
};
