import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Forgetfirst = () => {
  const [data, setData] = useState({
    email: "",
  });
  const [error, setError] = useState({});
 const navigate = useNavigate();
  const formdata = async (e) => {
    e.preventDefault();
    const arr = {};
    if (!data.email) arr.email = "Email is required";

    setError(arr);

    if (Object.keys(arr).length === 0) {
      const res = await axios.post("http://localhost:8090/users/otp", data);
      console.log(res);
        alert("OTP sent to your email");
        navigate("/forget");
      setData({
        email: "",
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

export default Forgetfirst;