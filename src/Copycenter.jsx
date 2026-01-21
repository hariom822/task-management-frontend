import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Center = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showTaskFormFor, setShowTaskFormFor] = useState(null);
  const [showUserFormFor, setShowUserFormFor] = useState(false);
  const [ShowTask, setShowTask] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState(null);
  const [theme,setTheme]=useState("")

  const [currentTaskId, setCurrentTaskId] = useState(null); // ✅ added

  const [error, setError] = useState({});
  const [task, setTask] = useState({
    task: "",
    date: "",
    assign_to: "",
  });

  const [taskForm, setTaskForm] = useState({
    task: "",
    date: "",
    Image: "",
    assign_to: "",
  });

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const id = JSON.parse(localStorage.getItem("user"));
  // const theme= JSON.parse(localStorage.getItem("theme"));
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("plese first login")
      navigate("/login");
    }
    fetchUsers();
    fetchTasks();
    fetchTheme();
  }, []);
    const fetchTheme = async () => {
       const token = JSON.parse(localStorage.getItem("token"));
    try {
      console.log("theme",theme)
      const res = await axios.post(
        "http://localhost:8090/users/theme",
        { color: theme }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const backendTheme = res.data.theme; // "dark" | "light"
      console.log("backendTheme",backendTheme)
      // localStorage.setItem("theme", JSON.stringify(backendTheme));
      setTheme(backendTheme);
    } catch (error) {
      console.log("Theme update failed", error);
    }
  };
  
  const formdata = async (e) => {
  e.preventDefault();
  console.log("data",data)
  if (!(data.name && data.email && data.phone )) {
    alert("all fields are required");
    return;
  }

  const token = JSON.parse(localStorage.getItem("token"));

  await axios.post("http://localhost:8090/users/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  alert("User added successfully");
  fetchUsers();
  setShowUserFormFor(false);

  setData({
    name: "",
    email: "",
    phone: "",
  });
};

  const fetchUsers = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.get("http://localhost:8090/users/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users || []);
  };

  const fetchTasks = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.get("http://localhost:8090/task/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data.tasks || []);
    console.log(res.data.tasks)

  };

 const openEditTask = (item) => {
  setCurrentTaskId(item._id);
  setTask({
    task: item.task,
    date: item.date,
    assign_to:
      typeof item.assign_to === "object"
        ? item.assign_to._id
        : item.assign_to,
  });
  setShowTask(true);
};


  const handleUpdate = async (e) => {
    e.preventDefault();

    const err = {};
    if (!task.task) err.task = "Task is required";
    if (!task.date) err.date = "Date is required";
    setError(err);

    if (Object.keys(err).length > 0) return;

    try {
      const token = JSON.parse(localStorage.getItem("token"));

      await axios.post(
        `http://localhost:8090/task/update/${currentTaskId}`,
        {
          task: task.task,
          date: task.date,
          assign_to: task.assign_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    
      setTasks((prev) =>
        prev.map((t) =>
          t._id === currentTaskId
            ? { ...t, task: task.task, date: task.date }
            : t
        )
      );

      setShowTask(false);
      alert("Task updated successfully");
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const deleteTask = async (taskId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.delete(
      `http://localhost:8090/task/delete/${taskId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const handleDrop = async (e, newUserId) => {
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    const token = JSON.parse(localStorage.getItem("token"));

    await axios.post(
      `http://localhost:8090/task/update/${taskId}`,
      { assign_to: newUserId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, assign_to: newUserId } : t
      )
    );
  };

  const filesubmit = (e) => {
    setTaskForm((x) => ({
      ...x,
      Image: e.target.files[0],
    }));
  };

  const addTask = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", taskForm.Image);
    formData.append("task", taskForm.task);
    formData.append("date", taskForm.date);
    formData.append("assign_to", taskForm.assign_to);

    const token = JSON.parse(localStorage.getItem("token"));

    const res = await axios.post(
      "http://localhost:8090/task",
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTasks((prev) => [...prev, res.data.task]);
    setShowTaskFormFor(null);
    
    setTaskForm({ task: "", date: "", assign_to: "" });
    window.location.reload();
  };

  const colorchange = (date, status) => {
    if (status === "completed") return "text-green-800 font-bold";
    const today = new Date();
    const taskDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today ? "text-red-500 font-bold" : "text-green-500 font-bold";
  };

 
   return (
  <div
    className={`min-h-screen p-6 transition ${
      theme === "dark"
        ? "bg-gradient-to-br from-gray-900 to-black text-white"
        : "bg-gradient-to-br from-indigo-50 to-blue-100 text-black"
    }`}
  >
    <h1 className="text-3xl font-bold text-center mb-6">
      Trello Style Task Board
    </h1>

    <div className="flex gap-6 overflow-x-auto pb-6">
      {users
        .filter((item) => item._id !== id)
        .map((user) => {
          const userTasks = tasks.filter(
            (t) => t.assign_to === user._id
          );

          return (
            <div
              key={user._id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, user._id)}
              className={`w-80 rounded-xl shadow-lg p-4 flex-shrink-0 relative transition ${
                theme === "dark"
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">{user.name}</h2>
              </div>

              <div className="space-y-3">
              {userTasks.map((item) => (
  <div
    key={item._id}
    draggable
    onDragStart={(e) =>
      e.dataTransfer.setData("taskId", item._id)
    }
    className={`p-3 rounded-lg cursor-move relative ${
      theme === "dark"
        ? "bg-gray-700"
        : "bg-indigo-50"
    }`}
  >
    <p className="font-medium">{item.task}</p>

    <p
      className={`text-xs ${colorchange(
        item.date,
        item.status
      )}`}
    >
      {item.date}
    </p>

    <button
      className="absolute top-2 right-2"
      onClick={() => setShowTaskMenu(item._id)}
    >
      ⋮
    </button>

    {showTaskMenu === item._id && (
      <div
        className={`absolute right-4 top-10 w-40 rounded-lg text-sm z-50 border ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700"
            : "bg-white"
        }`}
      >
        <div className="flex justify-end px-2 pt-1">
          <button
            className="text-gray-400 hover:text-red-500"
            onClick={() => setShowTaskMenu(null)}
          >
            ✕
          </button>
        </div>

        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => {
            openEditTask(item);   // 👈 item pass karo
            setShowTask(true);
          }}
        >
          ✏️ Edit
        </button>

        <button
          onClick={() => deleteTask(item._id)}
          className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-b-lg"
        >
          🗑 Delete
        </button>
      </div>
    )}
{ShowTask && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white text-black w-full max-w-md rounded-xl p-6 relative shadow-2xl">

      <button
        onClick={() => setShowTask(false)}
        className="absolute top-3 right-3 text-xl"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4 text-center">
        Edit Task
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          type="text"
          value={task.task}
          onChange={(e) =>
            setTask({ ...task, task: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          value={task.date}
          onChange={(e) =>
            setTask({ ...task, date: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Update
          </button>

          <button
            type="button"
            onClick={() => setShowTask(false)}
            className="flex-1 bg-red-600 text-white py-2 rounded"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
)}

  </div>
))}

              </div>

              <button
                onClick={() => {
                  setShowTaskFormFor(user._id);
                  setTaskForm((p) => ({ ...p, assign_to: user._id }));
                }}
                className="mt-4 w-full bg-indigo-500 text-white py-2 rounded"
              >
                + Add Task
              </button>

              {showTaskFormFor === user._id && (
                <form onSubmit={addTask} className="mt-2 space-y-2">
                  <input
                    className="w-full border p-1 rounded bg-transparent"
                    placeholder="Task name"
                    value={taskForm.task}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, task: e.target.value })
                    }
                    required
                  />

                  <input
                    type="date"
                    className="w-full border p-1 rounded bg-transparent"
                    value={taskForm.date}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, date: e.target.value })
                    }
                    required
                  />

                  <input
                    type="file"
                    onChange={filesubmit}
                    className="w-full border p-1 rounded bg-transparent"
                  />

                  <button className="w-full bg-green-500 text-white py-1 rounded">
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTaskFormFor(null)}
                    className="w-full bg-red-500 text-white py-1 rounded"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          );
        })}

      {/* Add User */}
      <div>
        <div
          className={`w-80 rounded-xl shadow-lg p-4 flex items-center justify-center ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <button
            className="text-2xl"
            onClick={() => setShowUserFormFor(!showUserFormFor)}
          >
            Add User +
          </button>
        </div>

        {showUserFormFor && (
          <div
            className={`w-80 mt-3 rounded-xl shadow-lg p-4 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <form onSubmit={formdata} className="space-y-3">

  <input
    className="w-full border p-2 rounded bg-transparent"
    placeholder="Name"
    value={data.name}
    onChange={(e) => setData({ ...data, name: e.target.value })}
  />

  <input
    className="w-full border p-2 rounded bg-transparent"
    placeholder="Email"
    value={data.email}
    onChange={(e) => setData({ ...data, email: e.target.value })}
  />

  <input
    className="w-full border p-2 rounded bg-transparent"
    placeholder="Phone"
    value={data.phone}
    onChange={(e) => setData({ ...data, phone: e.target.value })}
  />

  <button className="w-full bg-blue-600 text-white py-2 rounded">
    Submit
  </button>
</form>

          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default Center;












// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Center = () => {
//   const navigate = useNavigate();

//   const [users, setUsers] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [assignTo, setAssignTo] = useState([]);
//   const [assignBy, setAssignBy] = useState([]);
//   const [showTaskFormFor, setShowTaskFormFor] = useState(null);
//   const [showUserFormFor, setShowUserFormFor] = useState(false);
//   const [ShowTask, setShowTask] = useState(false);
//   const [showTaskMenu, setShowTaskMenu] = useState(null);
//   const [theme,setTheme]=useState("")
//   const [status,setStatus]=useState("")
//   const [currentTaskId, setCurrentTaskId] = useState(null); 
//  const [editMode, setEditMode] = useState("task");
//   const [error, setError] = useState({});
//   const [task, setTask] = useState({
//     task: "",
//     date: "",
//     assign_to: "",
//   });

//   const [taskForm, setTaskForm] = useState({
//     task: "",
//     date: "",
//     Image: "",
//     assign_to: "",
//   });

//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   const id = JSON.parse(localStorage.getItem("user"));
//   // const theme= JSON.parse(localStorage.getItem("theme"));
//   useEffect(() => {
//     const token = JSON.parse(localStorage.getItem("token"));
//     if (!token) {
//       alert("plese first login")
//       navigate("/login");
//     }
//     fetchTasksdata();
//     fetchUsers();
//     fetchTasks();
//     fetchTheme();
    
//   }, []);
  
//   // console.log("userTasks",tasks)
//      const fetchTasksdata = async () => {
//         const token = JSON.parse(localStorage.getItem("token"));
//   console.log("userTasks",tasks)
//       try {
//         const res = await axios.get(
//           "http://localhost:8090/task/findoneuser",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setAssignBy(Array.isArray(res.data.assignby) ? res.data.assignby : []);
//         // setAssignTo(Array.isArray(res.data.assignto) ? res.data.assignto : []);
//         setAssignTo(res.data.assignto)
//         console.log("res",res.data.assignto);
//         console.log("assignto",assignTo);
//       } catch (error) {
//         if (error.response?.data?.message === "Token expired") {
//           alert("Token expired, please login again");
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           navigate("/login");
//         }
//       }
//     };
//     const fetchTheme = async () => {
//        const token = JSON.parse(localStorage.getItem("token"));
//     try {
//       console.log("theme",theme)
//       const res = await axios.post(
//         "http://localhost:8090/users/theme",
//         { color: theme }, 
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const backendTheme = res.data.theme; // "dark" | "light"
//       console.log("backendTheme",backendTheme)
//       // localStorage.setItem("theme", JSON.stringify(backendTheme));
//       setTheme(backendTheme);
//     } catch (error) {
//       console.log("Theme update failed", error);
//     }
//   };
  
// const statusUpdate = async (e, id) => {
//   e.preventDefault(); // 🚫 page reload band
// console.log(id)
//   if (status !== "completed" && status !== "pending") {
//     alert("status must be 'completed' or 'pending'");
//     return;
//   }

//   const token = JSON.parse(localStorage.getItem("token"));

//   try {
//     await axios.post(
//       `http://localhost:8090/task/update/${id}`,
//       {
//         status: status,   // ✅ OBJECT (important)
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     alert("Task updated successfully");
//   } catch (err) {
//     console.error("Update task error", err);
//   }
// };


//   const formdata = async (e) => {
//   e.preventDefault();
//   console.log("data",data)
//   if (!(data.name && data.email && data.phone )) {
//     alert("all fields are required");
//     return;
//   }

//   const token = JSON.parse(localStorage.getItem("token"));

//   await axios.post("http://localhost:8090/users/", data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   alert("User added successfully");
//   fetchUsers();
//   setShowUserFormFor(false);

//   setData({
//     name: "",
//     email: "",
//     phone: "",
//   });
// };

//   const fetchUsers = async () => {
//     const token = JSON.parse(localStorage.getItem("token"));
//     const res = await axios.get("http://localhost:8090/users/all", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUsers(res.data.users || []);
//   };

//   const fetchTasks = async () => {
//     const token = JSON.parse(localStorage.getItem("token"));
//     const res = await axios.get("http://localhost:8090/task/all", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setTasks(res.data.tasks || []);
//     console.log(res.data.tasks)

//   };

//  const openEditTask = (item) => {
//   setCurrentTaskId(item._id);
//   setTask({
//     task: item.task,
//     date: item.date,
//     assign_to:
//       typeof item.assign_to === "object"
//         ? item.assign_to._id
//         : item.assign_to,
//   });
//   setShowTask(true);
// };


//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     const err = {};
//     if (!task.task) err.task = "Task is required";
//     if (!task.date) err.date = "Date is required";
//     setError(err);

//     if (Object.keys(err).length > 0) return;

//     try {
//       const token = JSON.parse(localStorage.getItem("token"));

//       await axios.post(
//         `http://localhost:8090/task/update/${currentTaskId}`,
//         {
//           task: task.task,
//           date: task.date,
//           assign_to: task.assign_to,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
    
//       setTasks((prev) =>
//         prev.map((t) =>
//           t._id === currentTaskId
//             ? { ...t, task: task.task, date: task.date }
//             : t
//         )
//       );

//       setShowTask(false);
//       alert("Task updated successfully");
//     } catch (err) {
//       console.error("Update error", err);
//     }
//   };

//   const deleteTask = async (taskId) => {
//     const token = JSON.parse(localStorage.getItem("token"));
//     await axios.delete(
//       `http://localhost:8090/task/delete/${taskId}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setTasks((prev) => prev.filter((t) => t._id !== taskId));
//   };

//   const handleDrop = async (e, newUserId) => {
//     const taskId = e.dataTransfer.getData("taskId");
//     if (!taskId) return;

//     const token = JSON.parse(localStorage.getItem("token"));

//     await axios.post(
//       `http://localhost:8090/task/update/${taskId}`,
//       { assign_to: newUserId },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setTasks((prev) =>
//       prev.map((t) =>
//         t._id === taskId ? { ...t, assign_to: newUserId } : t
//       )
//     );
//   };

//   const filesubmit = (e) => {
//     setTaskForm((x) => ({
//       ...x,
//       Image: e.target.files[0],
//     }));
//   };

//   const addTask = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("image", taskForm.Image);
//     formData.append("task", taskForm.task);
//     formData.append("date", taskForm.date);
//     formData.append("assign_to", taskForm.assign_to);

//     const token = JSON.parse(localStorage.getItem("token"));

//     const res = await axios.post(
//       "http://localhost:8090/task",
//       formData,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setTasks((prev) => [...prev, res.data.task]);
//     setShowTaskFormFor(null);
    
//     setTaskForm({ task: "", date: "", assign_to: "" });
//     window.location.reload();
//   };

//   const colorchange = (date, status) => {
//     if (status === "completed") return "text-green-800 font-bold";
//     const today = new Date();
//     const taskDate = new Date(date);
//     today.setHours(0, 0, 0, 0);
//     taskDate.setHours(0, 0, 0, 0);
//     return taskDate < today ? "text-red-500 font-bold" : "text-green-500 font-bold";
//   };

 
//    return (
//   <div
//     className={`min-h-screen p-6 transition ${
//       theme === "dark"
//         ? "bg-gradient-to-br from-gray-900 to-black text-white"
//         : "bg-gradient-to-br from-indigo-50 to-blue-100 text-black"
//     }`}
//   >
//     <h1 className="text-3xl font-bold text-center mb-6">
//       Trello Style Task Board
//     </h1>

//     <div className="flex gap-6 overflow-x-auto pb-6">
//       {users
//         .filter((item) => item._id !== id)
//         .map((user) => {
//          const userTasks = assignBy.filter(
//   (task) => task.assign_to && task.assign_to._id === user._id
// );

//           return (
//             <div
//               key={user._id}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => handleDrop(e, user._id)}
//               className={`w-80 rounded-xl shadow-lg p-4 flex-shrink-0 relative transition ${
//                 theme === "dark"
//                   ? "bg-gray-800"
//                   : "bg-white"
//               }`}
//             >
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="font-semibold">{user.name}</h2>
//               </div>

//               <div className="space-y-3">
//               {userTasks.map((item) => (
//   <div
//     key={item._id}
//     draggable
//     onDragStart={(e) =>
//       e.dataTransfer.setData("taskId", item._id)
//     }
//     className={`p-3 rounded-lg cursor-move relative ${
//       theme === "dark"
//         ? "bg-gray-700"
//         : "bg-indigo-50"
//     }`}
//   >
//     <p className="font-medium">{item.task}</p>

//     <p
//       className={`text-xs ${colorchange(
//         item.date,
//         item.status
//       )}`}
//     >
//       {item.date}
//     </p>

//     <button
//       className="absolute top-2 right-2"
//       onClick={() => setShowTaskMenu(item._id)}
//     >
//       ⋮
//     </button>

//     {showTaskMenu === item._id && (
//       <div
//         className={`absolute right-4 top-10 w-40 rounded-lg text-sm z-50 border ${
//           theme === "dark"
//             ? "bg-gray-900 border-gray-700"
//             : "bg-white"
//         }`}
//       >
//         <div className="flex justify-end px-2 pt-1">
//           <button
//             className="text-gray-400 hover:text-red-500"
//             onClick={() => setShowTaskMenu(null)}
//           >
//             ✕
//           </button>
//         </div>

//         <button
//           className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
//           onClick={() => {
//             openEditTask(item);   // 👈 item pass karo
//             setShowTask(true);
//           }}
//         >
//           ✏️ Edit
//         </button>

//         <button
//           onClick={() => deleteTask(item._id)}
//           className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-b-lg"
//         >
//           🗑 Delete
//         </button>
//       </div>
//     )}
// {ShowTask && (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//     <div className="bg-white text-black w-full max-w-md rounded-xl p-6 relative shadow-2xl">

//       <button
//         onClick={() => setShowTask(false)}
//         className="absolute top-3 right-3 text-xl"
//       >
//         ✕
//       </button>

//       <h2 className="text-xl font-semibold mb-4 text-center">
//         Edit Task
//       </h2>

//       <form onSubmit={handleUpdate} className="space-y-4">

//         <input
//           type="text"
//           value={task.task}
//           onChange={(e) =>
//             setTask({ ...task, task: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//           required
//         />

//         <input
//           type="date"
//           value={task.date}
//           onChange={(e) =>
//             setTask({ ...task, date: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//           required
//         />

//         <div className="flex gap-3">
//           <button
//             type="submit"
//             className="flex-1 bg-green-600 text-white py-2 rounded"
//           >
//             Update
//           </button>

//           <button
//             type="button"
//             onClick={() => setShowTask(false)}
//             className="flex-1 bg-red-600 text-white py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>

//       </form>
//     </div>
//   </div>
// )}

//   </div>
// ))}

//               </div>

//               <button
//                 onClick={() => {
//                   setShowTaskFormFor(user._id);
//                   setTaskForm((p) => ({ ...p, assign_to: user._id }));
//                 }}
//                 className="mt-4 w-full bg-indigo-500 text-white py-2 rounded"
//               >
//                 + Add Task
//               </button>

//               {showTaskFormFor === user._id && (
//                 <form onSubmit={addTask} className="mt-2 space-y-2">
//                   <input
//                     className="w-full border p-1 rounded bg-transparent"
//                     placeholder="Task name"
//                     value={taskForm.task}
//                     onChange={(e) =>
//                       setTaskForm({ ...taskForm, task: e.target.value })
//                     }
//                     required
//                   />

//                   <input
//                     type="date"
//                     className="w-full border p-1 rounded bg-transparent"
//                     value={taskForm.date}
//                     onChange={(e) =>
//                       setTaskForm({ ...taskForm, date: e.target.value })
//                     }
//                     required
//                   />

//                   <input
//                     type="file"
//                     onChange={filesubmit}
//                     className="w-full border p-1 rounded bg-transparent"
//                   />

//                   <button className="w-full bg-green-500 text-white py-1 rounded">
//                     Save
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setShowTaskFormFor(null)}
//                     className="w-full bg-red-500 text-white py-1 rounded"
//                   >
//                     Cancel
//                   </button>
//                 </form>
//               )}
//             </div>
//           );
//         })}

//       {/* Add User */}
//       <div>
//         <div
//           className={`w-80 rounded-xl shadow-lg p-4 flex items-center justify-center ${
//             theme === "dark" ? "bg-gray-800" : "bg-white"
//           }`}
//         >
//           <button
//             className="text-2xl"
//             onClick={() => setShowUserFormFor(!showUserFormFor)}
//           >
//             Add User +
//           </button>
//         </div>

//         {showUserFormFor && (
//           <div
//             className={`w-80 mt-3 rounded-xl shadow-lg p-4 ${
//               theme === "dark" ? "bg-gray-800" : "bg-white"
//             }`}
//           >
//             <form onSubmit={formdata} className="space-y-3">

//   <input
//     className="w-full border p-2 rounded bg-transparent"
//     placeholder="Name"
//     value={data.name}
//     onChange={(e) => setData({ ...data, name: e.target.value })}
//   />

//   <input
//     className="w-full border p-2 rounded bg-transparent"
//     placeholder="Email"
//     value={data.email}
//     onChange={(e) => setData({ ...data, email: e.target.value })}
//   />

//   <input
//     className="w-full border p-2 rounded bg-transparent"
//     placeholder="Phone"
//     value={data.phone}
//     onChange={(e) => setData({ ...data, phone: e.target.value })}
//   />

//   <button className="w-full bg-blue-600 text-white py-2 rounded">
//     Submit
//   </button>
// </form>

//           </div>
//         )}
//       </div>
//     </div>
//      <div className="flex gap-6 overflow-x-auto pb-6">
//       {users
//         .filter((item) => item._id !== id)
//         .map((user) => {
//          const userTasks = assignTo.filter(
//   (task) => task.assign_by && task.assign_by._id === user._id
// );

//           return (
//             <div
//               key={user._id}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => handleDrop(e, user._id)}
//               className={`w-80 rounded-xl shadow-lg p-4 flex-shrink-0 relative transition ${
//                 theme === "dark"
//                   ? "bg-gray-800"
//                   : "bg-white"
//               }`}
//             >
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="font-semibold">{user.name}</h2>
//               </div>

//               <div className="space-y-3">
//               {userTasks.map((item) => (
//   <div
//     key={item._id}
//     draggable
//     onDragStart={(e) =>
//       e.dataTransfer.setData("taskId", item._id)
//     }
//     className={`p-3 rounded-lg cursor-move relative ${
//       theme === "dark"
//         ? "bg-gray-700"
//         : "bg-indigo-50"
//     }`}
//   >
//     <p className="font-medium">{item.task}</p>

//     <p
//       className={`text-xs ${colorchange(
//         item.date,
//         item.status
//       )}`}
//     >
//       {item.date}
//     </p>

//     <button
//       className="absolute top-2 right-2"
//       onClick={() => setShowTaskMenu(item._id)}
//     >
//       ⋮
//     </button>

//     {showTaskMenu === item._id && (
//       <div
//         className={`absolute right-4 top-10 w-40 rounded-lg text-sm z-50 border ${
//           theme === "dark"
//             ? "bg-gray-900 border-gray-700"
//             : "bg-white"
//         }`}
//       >
//         <div className="flex justify-end px-2 pt-1">
//           <button
//             className="text-gray-400 hover:text-red-500"
//             onClick={() => setShowTaskMenu(null)}
//           >
//             ✕
//           </button>
//         </div>

//         <button
//           className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
//           onClick={() => {
//             openEditTask(item);   // 👈 item pass karo
//             setShowTask(true);
//           }}
//         >
//           ✏️ Edit
//         </button>
//       </div>
//     )}
// {ShowTask && (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//     <div className="bg-white text-black w-full max-w-md rounded-xl p-6 relative shadow-2xl">

//       <button
//         onClick={() => setShowTask(false)}
//         className="absolute top-3 right-3 text-xl"
//       >
//         ✕
//       </button>

//       <h2 className="text-xl font-semibold mb-4 text-center">
//         Edit status
//       </h2>

//       <form onSubmit={(e) => statusUpdate(e, item._id)} className="space-y-4">

//         <input
//           type="text"
//           value={status}
//           onChange={(e) =>
//              setStatus(e.target.value)
//           }
//           className="w-full border p-2 rounded"
//           required
//         />
//         <div className="flex gap-3">
//           <button
//             type="submit"
//             className="flex-1 bg-green-600 text-white py-2 rounded"
//           >
//             Update
//           </button>

//           <button
//             type="button"
//             onClick={() => setShowTask(false)}
//             className="flex-1 bg-red-600 text-white py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>

//       </form>
//     </div>
//   </div>
// )}

//   </div>
// ))}

//               </div>

              
//             </div>
//           );
//         })}

//       {/* Add User */}
//       <div>
        
//       </div>
//     </div>
//   </div>
// );
// }
// export default Center;