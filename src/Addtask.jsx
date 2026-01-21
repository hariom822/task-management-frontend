import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Addtask = () => {
  const [alldata, setAlldata] = useState([]);
  const [data, setData] = useState({
    date: "",
    task: "",
    Image: "",
    assign_to: ""
  });
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false); // <- Loader state
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("first login");
      navigate("/login");
    }
    fetchTasks();
  }, []);

  const id = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const res = await axios.get("http://localhost:8090/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlldata(Array.isArray(res.data.users) ? res.data.users : []);
      console.log(res.data);
    } catch (error) {
      if (error.response?.data?.message === "Token expired") {
        alert("Token expired, please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.task || !data.date) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true); // <- Loader on
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const formData = new FormData();
      formData.append("image", data.Image);
      formData.append("task", data.task);
      formData.append("date", data.date);
      formData.append("assign_to", data.assign_to);

      const res = await axios.post("http://localhost:8090/task/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Task Added Successfully");
      navigate("/oneuser");
      console.log(res.data);
    } catch (error) {
      if (error.response?.data?.message === "Token expired") {
        alert("Token expired, please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false); // <- Loader off
    }
  };

  const hendelchange = (e) => {
    const userid = e.target.value;
    setSelectedUser(userid);
    setData((prev) => ({
      ...prev,
      assign_to: userid,
    }));
  };

  const filesubmit = (e) => {
    setData((x) => ({
      ...x,
      Image: e.target.files[0],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
          Add New Task
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">User</label>
          <select
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedUser}
            onChange={hendelchange}
          >
            <option value="">--Select User--</option>
            {alldata
              .filter((item) => item._id !== id)
              .map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Task Name</label>
          <input
            type="text"
            value={data.task}
            onChange={(e) => setData({ ...data, task: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter task name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Image</label>
          <input
            type="file"
            onChange={filesubmit}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {data.Image && <p>Selected file: {data.Image.name}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center"
          disabled={loading} // <- disable button during loading
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : null}
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default Addtask;
