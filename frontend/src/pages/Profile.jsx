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

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Username, Email, and Current Password are required.");
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    update_user_profile(
      formData.username,
      formData.email,
      formData.password,
      formData.newPassword
    );

    // Optional: redirect or keep user on the page
    setTimeout(() => navigate("/profile"), 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded mt-8">
      <h2 className="text-2xl font-semibold mb-6">Update Profile</h2>

      {/* ✅ Show role */}
      {currentUser && (
        <p className="mb-4">
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
          className="w-full px-4 py-2 border rounded"
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Current Password"
          required
        />
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="New Password (optional)"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
