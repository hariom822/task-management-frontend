import React, { useEffect, useState } from "react";
import axios from "axios";

const Table = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");
  const [Users,setUsers]=useState([])
  const [theme,setTheme]=useState("")
    const [assignTo, setAssignTo] = useState([]);
    const [assignBy, setAssignBy] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
     const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("plese first login")
      navigate("/login");
    }
    fetchTasks();
    fetchUsers();
    fetchTheme();
  }, []);
       const fetchTheme = async () => {
       const token = JSON.parse(localStorage.getItem("token"));
    try {
      console.log("theme",theme)
      const res = await axios.post(
        "https://task-management-backend-tgvp.onrender.com/users/theme",
        { color: theme }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const backendTheme = res.data.theme; 
      console.log("backendTheme",backendTheme)
      setTheme(backendTheme);
    } catch (error) {
      console.log("Theme update failed", error);
    }
  };

    const fetchUsers = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.get("https://task-management-backend-tgvp.onrender.com/users/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users || []);
  };

  // const fetchTasks = async () => {
  //   const res = await axios.get("http://localhost:8090/task/alluser", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   setTasks(res.data.tasks || []);
  //   console.log("processedTasks",res.data.tasks)
  // };
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
  const processedTasks = [...assignBy]
    .filter((t) =>
      t.task.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "date-new") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortType === "date-old") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortType === "az") {
        return a.task.localeCompare(b.task);
      }
      if (sortType === "za") {
        return b.task.localeCompare(a.task);
      }
      return 0;
    });

 return (
  <div
    className={`p-6 min-h-screen transition ${
      theme === "dark"
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-black"
    }`}
  >
    <div className="flex gap-4 mb-4">
      <input
        className={`border p-2 rounded w-1/3 transition ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            : "bg-white text-black"
        }`}
        placeholder="Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className={`border p-2 rounded transition ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white text-black"
        }`}
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
      >
        <option value="">-- Sort By --</option>
        <option value="date-new">Date: Newest First</option>
        <option value="date-old">Date: Oldest First</option>
        <option value="az">Task: A → Z</option>
        <option value="za">Task: Z → A</option>
      </select>
    </div>
    <center> <h1 className="font-bold p-2">AssignBy tasks</h1></center>
   
    <div
      className={`overflow-x-auto shadow rounded transition ${
        theme === "dark"
          ? "bg-gray-800"
          : "bg-white"
      }`}
    >
      <table className="w-full border-collapse">
        <thead
          className={`${
            theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          <tr>
            <th className="p-3 text-left">Task</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-center">Date</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {processedTasks.map((task) => (
            <tr
              key={task._id}
              className={`border-b transition ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <td className="p-3">{task.task}</td>
              <td className="p-3">{task.assign_to?.name}</td>
              <td className="p-3 text-center">{task.date}</td>
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    task.status === "done"
                      ? theme === "dark"
                        ? "bg-green-900 text-green-300"
                        : "bg-green-100 text-green-700"
                      : theme === "dark"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status || "pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assignBy.length === 0 && (
        <p
          className={`text-center p-4 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          No tasks found
        </p>
      )}
    </div>
       <center> <h1 className="font-bold p-10">AssignTo tasks</h1></center>
        <div
      className={`overflow-x-auto shadow rounded transition pt-10 ${
        theme === "dark"
          ? "bg-gray-800"
          : "bg-white"
      }`}
    >
      <table className="w-full border-collapse">
        <thead
          className={`${
            theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          <tr>
            <th className="p-3 text-left">Task</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-center">Date</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {assignTo.map((task) => (
            <tr
              key={task._id}
              className={`border-b transition ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <td className="p-3">{task.task}</td>
              <td className="p-3">{task.assign_by?.name}</td>
              <td className="p-3 text-center">{task.date}</td>
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    task.status === "done"
                      ? theme === "dark"
                        ? "bg-green-900 text-green-300"
                        : "bg-green-100 text-green-700"
                      : theme === "dark"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status || "pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assignTo.length === 0 && (
        <p
          className={`text-center p-4 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          No tasks found
        </p>
      )}
    </div>
  </div>
);

};

export default Table;
