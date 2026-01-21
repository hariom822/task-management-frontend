import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Updateuser = () => {
  const { id } = useParams();
  const [task, setTask] = useState({
    name: "",
    phone: "",
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();
  const handleUpdate = async (e) => {
    e.preventDefault();

    const arr = {};
    if (!task.name) arr.name = "Name is required";
    if (!task.phone) arr.phone = "phone is required";

    setError(arr);

    if (Object.keys(arr).length === 0) {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        await axios.post(
          `http://localhost:8090/users/update/${id}`,
          task,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Task updated successfully");
        navigate("/dashboard");
      } catch (err) {
        console.error("Update task error", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-600">
      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Update User
        </h2>

        <div>
          <input
            type="text"
            placeholder="Name"
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {error.task && <p className="text-red-500 text-sm">{error.task}</p>}
        </div>

        <div>
          <input
            type="number"
            placeholder="phone"
            value={task.date}
            onChange={(e) => setTask({ ...task, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {error.phone && <p className="text-red-500 text-sm">{error.phone}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Update Task
        </button>
         <button onClick={()=>navigate("/dashboard")}
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Sklip
        </button>
      </form>
    </div>
  );
};

export default Updateuser;
