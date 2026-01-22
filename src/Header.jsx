import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));

  // 🔹 Load theme on refresh
  useEffect(() => {
    const savedTheme = JSON.parse(localStorage.getItem("theme"));
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // 🔹 Navigation select
  const handleMenuChange = (e) => {
    navigate(e.target.value);
  };

  const toggleTheme = async (e) => {
    e.preventDefault();
    try {
      console.log(theme)
      const res = await axios.post(
        "https://task-management-backend-tgvp.onrender.com/users/theme",
        { color: theme }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const backendTheme = res.data.theme; // "dark" | "light"
      console.log("backendTheme",backendTheme)
      localStorage.setItem("theme", JSON.stringify(backendTheme));
      setTheme(backendTheme);
      window.location.reload();
    } catch (error) {
      console.log("Theme update failed", error);
    }
  };

  return (
    <nav
      className={`${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Left Section */}
          <div className="flex items-center gap-3">
            <select
              className={`${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } px-3 py-2 rounded-md border focus:outline-none`}
              onChange={handleMenuChange}
            >
              <option value="/dashboard">☰ Menu</option>
              <option value="/center">Board</option>
              <option value="/calender">Calendar</option>
              <option value="/table">Table</option>
            </select>

            {/* Theme Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition duration-300 ${
                theme === "dark"
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
              title="Toggle Theme"
            >
              {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4 underline">

            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-300"
                }`
              }
            >
              Signup
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-300"
                }`
              }
            >
              DashBoard
            </NavLink>

             {/* <NavLink
              to="/oneuser"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-300"
                }`
              }
            >
              One User
            </NavLink>  */}

            <NavLink
              to="/user"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-300"
                }`
              }
            >
              Users
            </NavLink>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;