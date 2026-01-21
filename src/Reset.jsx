import React from "react";
import axios from "axios";

const Reset = () => {
  const [data, setData] = React.useState({
    email: "",
    oldpassword: "",
    newpassword: "",
    copassword: "",
  });
  const [error, setError] = React.useState({});

  const datasumit = async (e) => {
    e.preventDefault();
    const arr = {};
    if (!data.email) arr.email = "Email is required";
    if (!data.oldpassword) arr.oldpassword = "Old Password is required";
    if (!data.newpassword) arr.newpassword = "New Password is required";
    if (!data.copassword) arr.copassword = "Confirm Password is required";

    setError(arr);

    if (Object.keys(arr).length === 0) {
      if (data.newpassword !== data.copassword) {
        alert("New Password and Confirm Password do not match");
        return;
      }
      const res = await axios.post("http://localhost:8090/users/reset", data);
      console.log(res);
      alert("Password reset successful");
      navigate("/oneuser");
      setData({
        email: "",
        oldpassword: "",
        newpassword: "",
        copassword: "",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form
        onSubmit={datasumit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Reset Password
        </h2>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="oldpassword"
            placeholder="Old Password"
            value={data.oldpassword}
            onChange={(e) => setData({ ...data, oldpassword: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {error.oldpassword && (
            <p className="text-red-500 text-sm mt-1">{error.oldpassword}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="newpassword"
            placeholder="New Password"
            value={data.newpassword}
            onChange={(e) => setData({ ...data, newpassword: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {error.copassword && (
            <p className="text-red-500 text-sm mt-1">{error.copassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Reset;