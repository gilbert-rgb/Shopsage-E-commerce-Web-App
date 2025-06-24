import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext'; // Ensure correct path
import { toast } from 'react-toastify';
import { api_url } from '../config.json';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const { auth_token, currentUser } = useContext(UserContext);

  if (!currentUser || !currentUser.is_admin) {
    return <div className="text-center mt-20">Unauthorized. Admins only.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.length < 3) {
      toast.error("Product name must be at least 3 characters long.");
      return;
    }

    if (!price || isNaN(price)) {
      toast.error("Please enter a valid price.");
      return;
    }

    fetch(`${api_url}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth_token}`
      },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock || 0)
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Product added successfully!");
          setName('');
          setDescription('');
          setPrice('');
          setStock('');
        }
      })
      .catch(() => toast.error("An error occurred while adding the product."));
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-600 font-medium">Product Name</label>
          <input required
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-600 font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            placeholder="Enter product description"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-600 font-medium">Price</label>
          <input required
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            placeholder="Enter product price"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-gray-600 font-medium">Stock</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            placeholder="Enter stock quantity"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-3 rounded-md hover:bg-sky-600 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
