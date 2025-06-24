import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { api_url } from '../config.json';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { auth_token } = useContext(UserContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [onChange, setOnChange] = useState(false);

  // -------------------- Add Product (Admin Only) --------------------
  function addProduct(name, price, stock, description) {
    toast.loading("Adding product...");
    fetch(`${api_url}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`
      },
      body: JSON.stringify({ name, price, stock, description })
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) {
          toast.error(data.error);
        } else if (data.success) {
          toast.success(data.success);
          setOnChange(!onChange);
          navigate("/products");
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error while adding product.");
      });
  }

  // -------------------- Get All Products --------------------
  useEffect(() => {
    fetch(`${api_url}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        console.log("Fetched products:", data);
      })
      .catch(() => toast.error("Failed to fetch products"));
  }, [onChange]);

  // -------------------- Get Single Product --------------------
  function getProductById(id, callback) {
    fetch(`${api_url}/products/${id}`)
      .then(res => res.json())
      .then(data => callback(data))
      .catch(() => {
        toast.error("Failed to fetch product.");
        callback(null);
      });
  }

  // -------------------- Update Product (Admin Only) --------------------
  function updateProduct(id, fields) {
    toast.loading("Updating product...");
    fetch(`${api_url}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`
      },
      body: JSON.stringify(fields)
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          setOnChange(!onChange);
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error while updating product.");
      });
  }

  // -------------------- Delete Product (Admin Only) --------------------
  function deleteProduct(id) {
    toast.loading("Deleting product...");
    fetch(`${api_url}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          setOnChange(!onChange);
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error while deleting product.");
      });
  }

  // -------------------- Promote User to Admin --------------------
  function promoteUser(userId) {
    toast.loading("Promoting user...");
    fetch(`${api_url}/promote/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        toast.dismiss();
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success || data.message);
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Error while promoting user.");
      });
  }

  const contextData = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    promoteUser
  };

  return (
    <ProductContext.Provider value={contextData}>
      {children}
    </ProductContext.Provider>
  );
};
