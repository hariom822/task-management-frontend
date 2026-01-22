import { useState } from "react";
import axios from "axios";
import {   useNavigate } from "react-router-dom";
const Forget = () => {
  const [data, setData] = useState({
    email: "",
    otp: "",
    newpassword: "",
    copassword: "",
  });
  const [error, setError] = useState({});
  const navigate=useNavigate()
  const formdata = async (e) => {
    e.preventDefault();
    const arr = {};
    if (!data.email) arr.email = "Email is required";
    if (!data.newpassword) arr.newpassword = "Password is required";
    if (!data.copassword) arr.copassword = "Confirm Password is required";
    if (!data.otp) arr.otp = "OTP is required";

    setError(arr);

    if (Object.keys(arr).length === 0) {
      if (data.newpassword !== data.copassword) {
        alert("Password and Confirm Password do not match");
        return;
      }
      const res = await axios.post("https://task-management-backend-tgvp.onrender.com/users/forget", data);
      console.log(res);
      alert("Password reset successful");
      navigate("/oneuser");
      setData({
        email: "",
        otp: "",
        newpassword: "",
        copassword: "",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <form
        onSubmit={formdata}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Forget Password
        </h2>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="otp"
            placeholder="enter OTP"
            value={data.otp}
            onChange={(e) => setData({ ...data, otp: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {error.otp && (
            <p className="text-red-500 text-sm mt-1">{error.otp}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="newpassword"
            placeholder="New Password"
            value={data.newpassword}
            onChange={(e) => setData({ ...data, newpassword: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {error.newpassword && (
            <p className="text-red-500 text-sm mt-1">{error.newpassword}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="copassword"
            placeholder="Confirm Password"
            value={data.copassword}
            onChange={(e) => setData({ ...data, copassword: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {error.copassword && (
            <p className="text-red-500 text-sm mt-1">{error.copassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Forget;