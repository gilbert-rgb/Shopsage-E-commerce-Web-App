import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { ProductContext } from '../contexts/ProductContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const { auth_token, currentUser } = useContext(UserContext);
  const { addProduct } = useContext(ProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("✅ AddProduct loaded");
    console.log("👤 currentUser:", currentUser);
    console.log("🔑 auth_token:", auth_token);
  }, [currentUser, auth_token]);

  if (!currentUser || !currentUser.is_admin) {
    return <div className="text-center mt-20 text-red-600 text-xl">⛔ Unauthorized. Admins only.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.length < 3) return toast.error("Product name must be at least 3 characters long.");
    if (!price || isNaN(price)) return toast.error("Please enter a valid price.");

    addProduct(name, parseFloat(price), parseInt(stock || 0), description);
    setTimeout(() => navigate('/products'), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-3 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-3 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          className="w-full p-3 border rounded"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700" type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
