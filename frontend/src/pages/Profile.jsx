import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { currentUser, update_user_profile } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        username: currentUser.username,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { username, email, password, newPassword } = formData;

    if (!username || !email || !password) {
      toast.error("Username, Email, and Current Password are required.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    try {
      await update_user_profile(username, email, password, newPassword);
      toast.success("Profile updated successfully!");

      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Update Profile</h2>

      {currentUser && (
        <p className="mb-4 text-center">
          Role:{" "}
          <span
            className={`font-semibold ${
              currentUser.is_admin ? "text-green-600" : "text-gray-600"
            }`}
          >
            {currentUser.is_admin ? "Admin" : "User"}
          </span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Current Password"
          required
        />
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New Password (optional)"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
