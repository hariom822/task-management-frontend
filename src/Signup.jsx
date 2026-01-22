import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'

const Singup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
  })
const navigate=useNavigate()
  const formdata = async (e) => {
    e.preventDefault()
    if(!(data.name&&data.email&&data.phone)){
      alert("all filed are requride")
    }
    await axios.post("http://localhost:8090/users/", data)
    console.log(data)
    const token=JSON.parse(localStorage.getItem("token"))
        console.log(token)
   
     const result=axios.post("https://task-management-backend-tgvp.onrender.com/users/",data,{
        headers:{
            'Authorization':`Bearer ${token}`
        }
     })
      alert("Data Submitted Successfully")
     console.log(result)
     navigate("/oneuser")
    setData({
        name: "",
        email: "",
        phone: "",
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form
        onSubmit={formdata}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">Signup Form</h2>

        <input type="text" placeholder="First Name" value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />

       
        <input type="email" placeholder="Email" value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />

        <input type="number" placeholder="Phone" value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />

     
       
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
        <Link to="/login" className="text-blue-600 hover:underline block font-bold text-center">
          Already have an account? Login
        </Link>

      </form>
    </div>
  )
}

export default Singup