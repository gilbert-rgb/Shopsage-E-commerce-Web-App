import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { ProductContext } from '../contexts/ProductContext';

const AdminDashboard = () => {
  const {
    fetch_all_users,
    delete_user_admin,
    update_user_admin,
    create_user_by_admin,
  } = useContext(UserContext);

  const {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    promoteUser,
  } = useContext(ProductContext);

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false,
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
  });

  useEffect(() => {
    fetch_all_users(setUsers);
  }, []);

  const handleDeleteUser = (id) => {
    if (window.confirm('Delete this user?')) {
      delete_user_admin(id);
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleCreateUser = () => {
    create_user_by_admin(newUser);
    setNewUser({ username: '', email: '', password: '', is_admin: false });
    fetch_all_users(setUsers);
  };

  const handleCreateProduct = () => {
    const { name, price, stock, description } = newProduct;
    addProduct(name, price, stock, description);
    setNewProduct({ name: '', price: '', stock: '', description: '' });
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setEditProductData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setEditProductData({ name: '', price: '', stock: '', description: '' });
  };

  const handleUpdateProduct = async (id) => {
    await updateProduct(id, editProductData);
    cancelEditing();
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>

      {/* Create User */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Create New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 rounded"
          />
          <div className="flex items-center space-x-2">
            <label>
              <input
                type="checkbox"
                checked={newUser.is_admin}
                onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
                className="mr-1"
              />
              Admin
            </label>
            <button
              onClick={handleCreateUser}
              className="bg-green-600 text-white px-3 py-2 rounded"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <table className="min-w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Username</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Admin</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.is_admin ? 'Yes' : 'No'}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                {!user.is_admin && (
                  <button
                    onClick={() => promoteUser(user.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Promote
                  </button>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td className="p-3" colSpan="5">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Create Product */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Create New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={handleCreateProduct}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {/* Product Table */}
      <table className="min-w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Price</th>
            <th className="text-left p-3">Stock</th>
            <th className="text-left p-3">Description</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="p-3">{product.id}</td>
              <td className="p-3">
                {editingProductId === product.id ? (
                  <input
                    value={editProductData.name}
                    onChange={(e) =>
                      setEditProductData({ ...editProductData, name: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="p-3">
                {editingProductId === product.id ? (
                  <input
                    type="number"
                    value={editProductData.price}
                    onChange={(e) =>
                      setEditProductData({ ...editProductData, price: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  `$${product.price}`
                )}
              </td>
              <td className="p-3">
                {editingProductId === product.id ? (
                  <input
                    type="number"
                    value={editProductData.stock}
                    onChange={(e) =>
                      setEditProductData({ ...editProductData, stock: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td className="p-3">
                {editingProductId === product.id ? (
                  <input
                    value={editProductData.description}
                    onChange={(e) =>
                      setEditProductData({ ...editProductData, description: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  product.description
                )}
              </td>
              <td className="p-3 space-x-2">
                {editingProductId === product.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateProduct(product.id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(product)}
                      className="bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this product?')) deleteProduct(product.id);
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td className="p-3" colSpan="6">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
