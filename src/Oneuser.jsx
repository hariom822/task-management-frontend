import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Oneuser = () => {
  const [assignTo, setAssignTo] = useState([]);
  const [assignBy, setAssignBy] = useState([]);
  const [show, setShow] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8090/task/findoneuser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignBy(Array.isArray(res.data.assignby) ? res.data.assignby : []);
        setAssignTo(Array.isArray(res.data.assignto) ? res.data.assignto : []);
      } catch (error) {
        if (error.response?.data?.message === "Token expired") {
          alert("Token expired, please login again");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    fetchTasks();
  }, [show, navigate]);

  const handleDelete = async (id) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await axios.delete(`http://localhost:8090/task/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShow(!show);
      alert("Task deleted successfully");
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleUpdate = (userid, taskid) => {
    navigate(`/update/${userid}/${taskid}`);
  };

  const statusupdate = (id) => {
    navigate(`/status/${id}`);
  };

  const filtertasks = (tasks) => {
    return tasks.filter((e) =>
      e.task.toLowerCase().includes(search.toLowerCase())
    );
  };

  const sortTasks = (tasks) => {
    if (!sortBy) return tasks;
    const sorted = [...tasks];
    if (sortBy === "date") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    if (sortBy === "status") {
      sorted.sort((a, b) => a.status.localeCompare(b.status));
    }
    return sorted;
  };

  const colorchange = (date, status) => {
    if (status === "completed") {
      return "bg-green-800 font-bold";
    }

    const currentDate = new Date();
    const taskDate = new Date(date);

    currentDate.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate < currentDate) {
      return "bg-red-500 font-bold";
    } else {
      return "bg-green-500 font-bold";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="overflow-x-auto">
        <div className="border-b border-gray-700 m-3 mt-4 pl-2 flex justify-between items-center">
          <div className="flex gap-4">
            <input
              className="border border-gray-600  rounded px-4 py-2 "
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border border-gray-600 text-white bg-black rounded px-4 py-2 "
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="date">Date</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="border p-2">Task</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Assign By</th>
              <th className="border p-2">Assign To</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">image</th>
              <th className="border p-2">Status Update</th>
            </tr>
          </thead>
          <tbody>
            {assignTo.length > 0 ? (
              sortTasks(filtertasks(assignTo)).map((task) => (
                <tr key={task._id} className="text-center">
                  <td className={`border p-2 ${colorchange(task.date, task.status)}`}>{task.task}</td>
                  <td className={`border p-2 ${colorchange(task.date, task.status)}`}>{task.date}</td>
                  <td className={`border p-2 ${colorchange(task.date, task.status)}`}>{task.assign_by?.name}</td>
                  <td className={`border p-2 ${colorchange(task.date, task.status)}`}>{task.assign_to?.name}</td>
                  <td className={`border p-2 ${colorchange(task.date, task.status)}`}>{task.status}</td>
                   <td className="border p-2">
                 {task.Image ? (
                 <img src={task.Image} alt="Task"
                       className="w-full h-15 object-cover rounded-md" />
                  ) : ( "No Image" )}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => statusupdate(task._id)}
                      className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-gray-400">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 mt-10">
        My Assigned Tasks
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="border p-2">Task</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Assign By</th>
              <th className="border p-2">Assign To</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
              <th className="border p-2">image</th>
            </tr>
          </thead>
          <tbody>
            {assignBy.length > 0 ? (
              assignBy.map((task) => (
                <tr key={task._id} className="text-center">
                  <td className="border p-2">{task.task}</td>
                  <td className="border p-2">{task.date}</td>
                  <td className="border p-2">{task.assign_by?.name}</td>
                  <td className="border p-2">{task.assign_to?.name}</td>
                  <td className="border p-2">{task.status}</td>
                 <td className="border p-2">
                 {task.Image ? (
                 <img src={task.Image} alt="Task"
                       className="w-full h-15 object-cover rounded-md" />
                  ) : ( "No Image" )}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleUpdate(task.assign_to?._id, task._id)}
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
                <td colSpan="6" className="p-4 text-gray-400">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Oneuser;
