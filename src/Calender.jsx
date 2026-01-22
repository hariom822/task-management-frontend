import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [theme, setTheme] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const res = await axios.post(
        "https://task-management-backend-tgvp.onrender.com/users/theme",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTheme(res.data.theme);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "https://task-management-backend-tgvp.onrender.com/task/findoneuser",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const assignBy = Array.isArray(res.data.assignby)
        ? res.data.assignby.map(t => ({ ...t, _type: "assignBy" }))
        : [];

      const assignTo = Array.isArray(res.data.assignto)
        ? res.data.assignto.map(t => ({ ...t, _type: "assignTo" }))
        : [];

      setTasks([...assignBy, ...assignTo]);
    } catch (error) {
      if (error.response?.data?.message === "Token expired") {
        alert("Token expired, please login again");
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from(
    { length: firstDay + totalDays },
    (_, i) => (i < firstDay ? null : i - firstDay + 1)
  );

  const changeMonth = (val) => {
    setCurrentDate(new Date(year, month + val, 1));
  };

  const getTasksByDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return tasks.filter((t) => t.date === dateStr);
  };

  return (
    <div
      className={`min-h-screen p-6 transition ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="px-4 py-1 bg-indigo-600 text-white rounded"
        >
          ◀ Prev
        </button>

        <h2 className="text-2xl font-semibold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>

        <button
          onClick={() => changeMonth(1)}
          className="px-4 py-1 bg-indigo-600 text-white rounded"
        >
          Next ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2 text-center font-semibold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((day, i) => (
          <div
            key={i}
            className={`rounded-lg min-h-[130px] p-2 shadow ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            {day && (
              <>
                <div className="font-bold text-sm mb-1">{day}</div>

                {getTasksByDate(day).map((task) => (
                  <div
                    key={task._id}
                    className={`text-xs rounded px-2 py-1 mb-1 border-l-4 ${
                      task._type === "assignBy"
                        ? "bg-red-100 text-red-800 border-red-500"
                        : "bg-green-100 text-green-800 border-green-500"
                    }`}
                  >
                    <div className="font-medium truncate">
                      {task.task}
                    </div>

                    <div className="text-[10px] opacity-70">
                      {task._type === "assignBy"
                        ? `Assigned by: ${task.assign_by?.name} and
                        Assigned to: ${task.assign_to?.name}`
                        : `Assigned by: ${task.assign_by?.name} and
                        Assigned to  : ${task.assign_to?.name}
                        `}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded"></span>
          Assigned to You
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded"></span>
          Assigned by You
        </div>
      </div>
    </div>
  );
};

export default Calendar;
