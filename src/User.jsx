import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

const User = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const savedTheme = JSON.parse(localStorage.getItem("theme"));
    if (savedTheme) {
      setTheme(savedTheme);
    }

    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8090/users/oneuser",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error("Fetch user error", err);
    }
  };

  const toggleTheme = async (e) => {
    e.preventDefault();
    try {
      console.log("current theme:", theme);

      const res = await axios.post(
        "http://localhost:8090/users/theme",
        { color: theme }, // same as Header
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const backendTheme = res.data.theme;
      console.log("backendTheme:", backendTheme);

      localStorage.setItem("theme", JSON.stringify(backendTheme));
      setTheme(backendTheme);

      // Header jaisa behaviour
      window.location.reload();
    } catch (error) {
      console.log("Theme update failed", error);
    }
  };

  const handleResetPassword = () => {
    navigate("/reset");
  };

  const handleUserUpdate = (id) => {
    navigate(`/updateuser/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8090/users/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.clear();
      alert("Account deleted successfully");
      navigate("/login");
    } catch (err) {
      console.error("Delete user error", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout Successfully");
    navigate("/login");
  };

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading...
      </p>
    );
  }

  return (
    <div
      className={`flex justify-center items-center min-h-screen transition ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`shadow-lg rounded-lg p-6 w-full max-w-md transition ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          User Profile
        </h2>

        <p className="mb-2">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="mb-4">
          <strong>Phone:</strong> {user.phone}
        </p>

        <button
          onClick={handleResetPassword}
          className="w-full bg-blue-600 text-white py-2 rounded mb-3 hover:bg-blue-700 transition"
        >
          Reset Password
        </button>

        <button
          onClick={() => handleUserUpdate(user._id)}
          className="w-full bg-green-600 text-white py-2 rounded mb-3 hover:bg-green-700 transition"
        >
          Update Profile
        </button>

        {/* THEME TOGGLE – SAME AS HEADER */}
        <button
          onClick={toggleTheme}
          className={`w-full py-2 rounded mb-3 flex items-center justify-center gap-2 transition ${
            theme === "dark"
              ? "bg-yellow-400 text-black hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          title="Toggle Theme"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={() => handleDelete(user._id)}
          className="w-full bg-red-600 text-white py-2 rounded mb-3 hover:bg-red-700 transition"
        >
          Delete Account
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-500 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default User;
