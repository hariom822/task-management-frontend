import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Statusupdate = () => {
  const { id } = useParams();
  const [task, setTask] = useState({
    status:"",
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();
  const handleUpdate = async (e) => {
    e.preventDefault();
   console.log(id)
    const arr = {};
    if (!task.status) arr.status = "status is required";
    setError(arr);
    
   if(task.status!=="completed" && task.status!=="pending"){
    alert("status must be 'completed' or 'pending'");
    return;
   }
    if (Object.keys(arr).length === 0) {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        await axios.post(
          `http://localhost:8090/task/update/${id}`,
          task,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Task updated successfully");
        navigate("/oneuser");
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
          Update status
        </h2>

        <div>
          <input
            type="text"
            placeholder="Task"
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {error.status && <p className="text-red-500 text-sm">{error.status}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default Statusupdate;
