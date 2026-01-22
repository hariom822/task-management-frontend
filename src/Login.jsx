import React, { useState } from "react";
import axios from "axios";
import api from "./api";
console.log(">>>>>>>>>>>>>>>>>>>>>>", api)
import { Link,useNavigate } from "react-router-dom";
const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState({});
  const navigate=useNavigate()
  const datasumit = async (e) => {
    e.preventDefault();
    const arr = {};
    if (!form.email) arr.email = "Email is required";
    if (!form.password) arr.password = "Password is required";
    setError(arr);

    if (Object.keys(arr).length === 0) {
      try {
        
      const user = await axios.post("https://task-management-backend-tgvp.onrender.com/users/login", form);
        console.log(user.data);
        localStorage.setItem("token", JSON.stringify(user.data.token));
        localStorage.setItem("user", JSON.stringify(user.data.id));
        alert("Login successfully");
        const phone=user.data.phone
        const name=user.data.name
        const id=user.data.id
        console.log(phone,name,id)
        if(!phone &&!name){
          navigate(`/updateuser/${id}`)
        }else navigate(`/dashboard`);
      } catch (err) {
        alert("Login failed");
        console.error(err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form
        onSubmit={datasumit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
        <div>
        <Link to="/forgetfirst" className="text-blue-600 hover:underline block font-bold text-center">

            Forgot Password?
        </Link>
        <Link to="/signup" className="text-blue-600 hover:underline block font-bold text-center">
        Signup
        </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;