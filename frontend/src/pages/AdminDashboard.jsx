import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const AdminDashboard = () => {
  const {
    fetch_all_users,
    delete_user_admin,
    update_user_admin,
    create_user_by_admin,
  } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', is_admin: false });

  useEffect(() => {
    fetch_all_users(setUsers);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      delete_user_admin(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleCreate = () => {
    create_user_by_admin(newUser);
    setNewUser({ username: '', email: '', password: '', is_admin: false });
    fetch_all_users(setUsers);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin User Dashboard</h2>

      <div className="bg-white shadow p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">Create New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Username" value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            className="border p-2 rounded" />
          <input type="email" placeholder="Email" value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded" />
          <input type="password" placeholder="Password" value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 rounded" />
          <div className="flex items-center space-x-2">
            <label>
              <input type="checkbox" checked={newUser.is_admin}
                onChange={e => setNewUser({ ...newUser, is_admin: e.target.checked })}
                className="mr-1" /> Admin
            </label>
            <button onClick={handleCreate} className="bg-green-600 text-white px-3 py-2 rounded">Create</button>
          </div>
        </div>
      </div>

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
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.is_admin ? 'Yes' : 'No'}</td>
              <td className="p-3 space-x-2">
                {/* Add edit logic here if needed */}
                <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && <tr><td className="p-3" colSpan="5">No users found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
