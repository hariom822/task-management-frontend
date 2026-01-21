import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [assignTo, setAssignTo] = useState([]);
      const [assignBy, setAssignBy] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState("");
 const COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#06b6d4", // cyan
  "#a855f7", // purple
];

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
     const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("plese first login")
      navigate("/login");
    }
    if (token) {
      fetchUsers();
      fetchTasks();
      fetchTheme();
    }
  }, []);

  const id = JSON.parse(localStorage.getItem("user"));
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
      setTheme(backendTheme);
    } catch (error) {
      console.log("Theme update failed", error);
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:8090/users/all",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUsers(res.data.users || []);
  };

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
  // const totalUsers = assignBy.length;
  // const totalTasks = assignTo.length;
  // const completedTasks = assignBy.filter(
  //   (t) => t.status === "completed"
  // ).length;
  // const pendingTasks = totalTasks - completedTasks;
  //  const completed = assignTo.filter(
  //   (t) => t.status === "completed"
  // ).length;
  // const pending = totalTasks - completed;
  const totalAssignTo = assignTo.length;

const completedAssignTo = assignTo.filter(
  (t) => t.status === "completed"
).length;

const pendingAssignTo = assignTo.filter(
  (t) => t.status !== "completed"
).length;
const totalAssignBy = assignBy.length;

const completedAssignBy = assignBy.filter(
  (t) => t.status === "completed"
).length;

const pendingAssignBy = assignBy.filter(
  (t) => t.status !== "completed"
).length;


  // /* ================= DATE HELPERS ================= */
  // const today = new Date();

  // const isSameDay = (d1, d2) =>
  //   d1.getDate() === d2.getDate() &&
  //   d1.getMonth() === d2.getMonth() &&
  //   d1.getFullYear() === d2.getFullYear();

  // const isSameWeek = (date) => {
  //   const start = new Date(today);
  //   start.setDate(today.getDate() - today.getDay());
  //   const end = new Date(start);
  //   end.setDate(start.getDate() + 6);
  //   return date >= start && date <= end;
  // };

  // const isSameMonth = (date) =>
  //   date.getMonth() === today.getMonth() &&
  //   date.getFullYear() === today.getFullYear();

  // const isSameYear = (date) =>
  //   date.getFullYear() === today.getFullYear();

  const userWiseData = users.filter((item) => item._id !== id).map((user) => {
    const assignToCount = assignBy.filter(
      (t) => t.assign_to && t.assign_to._id === user._id
    ).length;


    return {
      name: user.name,
      assignTo: assignToCount,
      
    };
  });
   const userWiseDatay = users.filter((item) => item._id !== id).map((user) => {
    const assignByCount = assignTo.filter(
      (t) => t.assign_by && t.assign_by._id === user._id
    ).length;

    return {
      name: user.name,
     
      assignBy: assignByCount,
    };
  })
    // { name: "Total", value: assignTo.length },
    // {
    //   name: "Today",
    //   value: assignTo.filter((t) =>
    //     isSameDay(new Date(t.date), today)
    //   ).length,
    // },
    // {
    //   name: users.name,
    //   value: assignTo.filter((t) =>
    //     isSameWeek(new Date(t.date))
    //   ).length,
    // },
    // {
    //   name: users.name,
    //   value: assignTo.filter((t) =>
    //     isSameMonth(new Date(t.date))
    //   ).length,
    // },
    // {
    //   name: "This Year",
    //   value: assignTo.filter((t) =>
    //     isSameYear(new Date(t.date))
    //   ).length,
    // },
  

return (
  <div
    className={`p-6 min-h-screen transition ${
      theme === "dark"
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-black"
    }`}
  >
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6  ">
      <Card title="assignto" value={totalAssignTo } theme={theme} />
       <Card title="assignto completedTasks" value={completedAssignTo } theme={theme} />
      <Card title="assignto pendingTasks" value={pendingAssignTo } theme={theme} />
       <Card title="assignby" value={totalAssignBy } theme={theme} />
      <Card title="assignby completedTasks" value={completedAssignBy } theme={theme} />
      <Card title="assignby pendingTasks" value={pendingAssignBy } theme={theme} />
     
    </div>
     <h2 className="text-xl font-semibold mb-4">
        Task Overview
      </h2>
      <hr/>
    <div
      className={`shadow flex rounded p-6 w-full transition mb-10 ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }`}
    >
    
       <div className="w-full h-[400px] ">
         <h2 className="text-xl font-semibold mb-4 ml-15">
        Tassignto
      </h2>
      
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={userWiseData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#4b5563" : "#d1d5db"}
            />

            <XAxis
              dataKey="name"
              tick={{ fill: theme === "dark" ? "#e5e7eb" : "#374151" }}
              axisLine={{ stroke: theme === "dark" ? "#6b7280" : "#9ca3af" }}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: theme === "dark" ? "#e5e7eb" : "#374151" }}
              axisLine={{ stroke: theme === "dark" ? "#6b7280" : "#9ca3af" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              cursor={{ fill: theme === "dark" ? "#1f2937" : "#f3f4f6" }}
            />

            <Bar
              dataKey="assignTo"
              fill={theme === "dark" ? "#60a5fa" : "#1f2937"}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full h-[400px]">
        <h2 className="text-xl font-semibold mb-4 ml-15">
        Tassignby
      </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ userWiseDatay}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#4b5563" : "#d1d5db"}
            />

            <XAxis
              dataKey="name"
              tick={{ fill: theme === "dark" ? "#e5e7eb" : "#374151" }}
              axisLine={{ stroke: theme === "dark" ? "#6b7280" : "#9ca3af" }}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: theme === "dark" ? "#e5e7eb" : "#374151" }}
              axisLine={{ stroke: theme === "dark" ? "#6b7280" : "#9ca3af" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
              cursor={{ fill: theme === "dark" ? "#1f2937" : "#f3f4f6" }}
            />

           <Bar
  dataKey="assignBy"
  fill={theme === "dark" ? "#60a5fa" : "#2563eb"}
  radius={[6, 6, 0, 0]}
/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
    <hr/>
     <div
      className={`shadow flex rounded p-6 w-full transition ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }`}
    >
      <div className="w-full h-[400px] ">
  <h2 className="text-xl font-semibold mb-4 text-center">
    Assign To (User wise)
  </h2>

  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={userWiseData}
        dataKey="assignTo"
        nameKey="name"
        innerRadius={70}
        outerRadius={120}
        paddingAngle={4}
      >
        {userWiseData.map((_, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>

      <div className="w-full h-[400px]">
  <h2 className="text-xl font-semibold mb-4 text-center">
    Assign By (User wise)
  </h2>

  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={userWiseDatay}
        dataKey="assignBy"
        nameKey="name"
        innerRadius={70}
        outerRadius={120}
        paddingAngle={4}
      >
        {userWiseDatay.map((_, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>

      
    </div>
  </div>
);



};

export default Dashboard;

/* ================= CARD ================= */
const Card = ({ title, value, color, theme }) => (
  <div
    className={`shadow rounded p-4 ${
      theme === "dark" ? "bg-gray-800" : "bg-white"
    }`}
  >
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p
      className={`text-3xl font-bold ${
        color === "green"
          ? "text-green-500"
          : color === "yellow"
          ? "text-yellow-500"
          : ""
      }`}
    >
      {value}
    </p>
  </div>
);
