import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../config.json";

const api_url = config.api_url;
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [auth_token, setAuthToken] = useState(() => localStorage.getItem("access_token"));

  // ========== Register ==========
  const register_user = (username, email, password) => {
    toast.loading("Registering...");
    fetch(`${api_url}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then(res => res.json())
      .then(res => {
        toast.dismiss();
        if (res.error) toast.error(res.error);
        else {
          toast.success(res.success);
          navigate("/login");
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Registration failed.");
      });
  };

  // ========== Login ==========
  const login_user = (email, password) => {
    toast.loading("Logging in...");
    fetch(`${api_url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(res => {
        toast.dismiss();
        if (res.error) toast.error(res.error);
        else {
          toast.success("Logged in!");
          localStorage.setItem("access_token", res.access_token);
          setAuthToken(res.access_token);
          setTimeout(() => navigate("/"), 100);
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Login failed.");
      });
  };

  // ========== Logout ==========
  const logout_user = () => {
    const token = localStorage.getItem("access_token");
    if (!token || token === "null") {
      toast.warning("Already logged out.");
      localStorage.removeItem("access_token");
      setAuthToken(null);
      setCurrentUser(null);
      navigate("/login");
      return;
    }

    fetch(`${api_url}/logout`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => Promise.reject(data.error));
        return res.json();
      })
      .then(res => {
        toast.success(res.success || "Logged out.");
        localStorage.removeItem("access_token");
        setAuthToken(null);
        setCurrentUser(null);
        navigate("/login");
      })
      .catch(error => {
        toast.error(error || "Logout failed.");
      });
  };

  // ========== Fetch Current User ==========
  useEffect(() => {
    if (auth_token && auth_token !== "null") {
      fetch(`${api_url}/current_user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
      })
        .then(res => {
          if (!res.ok) {
            if (res.status === 401) return Promise.reject("Session expired. Please login again.");
            return Promise.reject("Failed to fetch user.");
          }
          return res.json();
        })
        .then(data => {
          setCurrentUser(data);
        })
        .catch(err => {
          toast.error(err);
          logout_user();
        });
    }
  }, [auth_token]);

  // ========== Update Profile ==========
  const update_user_profile = (username, email, password, newPassword) => {
    toast.loading("Updating profile...");
    fetch(`${api_url}/update_user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ username, email, password, newPassword }),
    })
      .then(res => res.json())
      .then(res => {
        toast.dismiss();
        res.error ? toast.error(res.error) : toast.success(res.success);
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Update failed.");
      });
  };

  // ========== Delete Profile ==========
  const delete_profile = () => {
    toast.loading("Deleting account...");
    fetch(`${api_url}/delete_user_profile`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        toast.dismiss();
        if (res.success) {
          toast.success(res.success);
          localStorage.removeItem("access_token");
          setAuthToken(null);
          setCurrentUser(null);
          navigate("/login");
        } else {
          toast.error(res.error || "Delete failed.");
        }
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Delete failed.");
      });
  };

  // ========== Admin ==========

  const fetch_all_users = callback => {
    fetch(`${api_url}/users`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then(res => res.json())
      .then(data => callback(data))
      .catch(() => {
        toast.error("Unable to fetch users.");
        callback([]);
      });
  };

  const fetch_user_by_id = (userId, callback) => {
    fetch(`${api_url}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then(res => res.json())
      .then(data => callback(data))
      .catch(() => {
        toast.error("Failed to fetch user.");
        callback(null);
      });
  };

  const update_user_admin = (userId, data) => {
    toast.loading("Updating user...");
    fetch(`${api_url}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(res => {
        toast.dismiss();
        res.error ? toast.error(res.error) : toast.success(res.success);
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Update failed.");
      });
  };

  const delete_user_admin = userId => {
    toast.loading("Deleting user...");
    fetch(`${api_url}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        toast.dismiss();
        res.error ? toast.error(res.error) : toast.success(res.success);
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Delete failed.");
      });
  };

  const create_user_by_admin = ({ username, email, password, is_admin = false }) => {
    toast.loading("Creating user...");
    fetch(`${api_url}/admin/create_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ username, email, password, is_admin }),
    })
      .then(res => res.json())
      .then(res => {
        toast.dismiss();
        res.error ? toast.error(res.error) : toast.success(res.message || "User created");
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Creation failed.");
      });
  };

  // ========== Context ==========
  const context_data = {
    auth_token,
    currentUser,
    register_user,
    login_user,
    logout_user,
    update_user_profile,
    delete_profile,
    fetch_all_users,
    fetch_user_by_id,
    update_user_admin,
    delete_user_admin,
    create_user_by_admin,
  };

  return <UserContext.Provider value={context_data}>{children}</UserContext.Provider>;
};
