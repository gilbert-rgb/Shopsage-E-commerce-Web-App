import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { api_url } from '../config.json';

const ProductList = () => {
  const { auth_token } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    fetch(`${api_url}/products`)
      .then(res => res.json())
      .then(setProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    fetch(`${api_url}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth_token}` }
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        fetchProducts(); // Refresh after deletion
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Product List</h1>
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="text-center">
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">${p.price}</td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2 space-x-2">
                <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => deleteProduct(p.id)}>
                  Delete
                </button>
                {/* Add Edit link if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
