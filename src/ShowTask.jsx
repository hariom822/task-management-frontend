import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ShowTask = () => {
  const { userId } = useParams();
  console.log("User ID from params:", userId);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      showTasks();
    }
  }, [userId]);
const showTasks = async () => {
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const res = await axios.get(
      "https://task-management-backend-tgvp.onrender.com/task/usertask",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const allTasks = Array.isArray(res.data.tasks) ? res.data.tasks : [];

    const filteredTasks = allTasks.filter(
      task => task.assign_to?._id === userId
    );

    setTasks(filteredTasks);
  } catch (error) {
    if (error.response?.data?.message === "Token expired") {
      localStorage.clear();
      navigate("/login");
    } else {
      console.error(error);
    }
  }
};
const handleDelete = async (id) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await axios.delete(
        `https://task-management-backend-tgvp.onrender.com/task/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setTasks(!show);
      alert("Task deleted successfully");
    } catch (error) {
      console.error("Delete error", error);
    }
  };
  const handleUpdate = (userid,taskid) => {
    navigate(`/update/${userid}/${taskid}`);
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">User Tasks</h2>

      {tasks.length > 0 ? (
        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="border p-2">Task</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Assign To</th>
              <th className="border p-2">Assign By</th>
              <th className="border p-2">Status</th>
               <th className="border p-2">action</th>
            </tr>
          </thead>
          <tbody>
             {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} className="text-center">
                  <td className="border p-2">{task.task}</td>
                  <td className="border p-2">{task.date}</td>
                  <td className="border p-2">{task.assign_by}</td>
                  <td className="border p-2">{task.assign_to?._id}</td>
                  <td className="border p-2">{task.status}</td>
                  
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleUpdate(task.assign_to?._id,task._id)}
                      className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-gray-400">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No tasks found</p>
      )}
    </div>
  );
};

export default ShowTask;
