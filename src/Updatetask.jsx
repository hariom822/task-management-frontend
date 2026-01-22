import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Updatetask = () => {
  const { userid,taskid } = useParams();
  console.log(userid,taskid)
  const [task, setTask] = useState({
    task: "",
    date: "",
    assign_to: userid,
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const handleUpdate = async (e) => {
    e.preventDefault();
    const arr = {};
    if (!task.task) arr.task = "Task is required";
    if (!task.date) arr.date = "Date is required";

    setError(arr);

    if (Object.keys(arr).length === 0) {
      const token = JSON.parse(localStorage.getItem("token"));
      console.log(task);
      try {
        await axios.post(
          `https://task-management-backend-tgvp.onrender.com/task/update/${taskid}`,
          task,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-4">

        <h2 className="text-2xl font-bold text-center text-gray-700">
          Update Task
        </h2>
        <div>
          <input
            type="text"
            placeholder="Task"
            value={task.task}
            onChange={(e) => setTask({ ...task, task: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {error.task && <p className="text-red-500 text-sm">{error.task}</p>}
        </div>

        <div>
          <input type="date"
            placeholder="Date"
            value={task.date}
            onChange={(e) => setTask({ ...task, date: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {error.date && <p className="text-red-500 text-sm">{error.date}</p>}
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

export default Updatetask;
