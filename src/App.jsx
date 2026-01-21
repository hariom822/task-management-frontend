import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Singup from './Signup'
import Login from './Login'
import Header from './Header'
import Forget from './Forget'
import Forgetfirst from './Forgetfirst'
import Reset from './Reset'
import Oneuser from './Oneuser'
import Updatetask from './Updatetask'
import User from './User'
import Addtask from './Addtask'
import Statusupdate from "./Statusupdate"
import Updateuser from './updateuser.jsx'
import ShowTask from './ShowTask.jsx'
import Center from './Center.jsx'
import Table from './Table.jsx'
import Calender from './Calender.jsx'
import Dashboard from './Dashboard.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import { useLocation } from "react-router-dom"

function App() {
  const location = useLocation();
const hideHeader = location.pathname === "/login" || location.pathname === "/signup"
||  location.pathname === "/";
  return (
    <>
  
     {!hideHeader && <Header />}
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/forgetfirst' element={<Forgetfirst/>}/>
        <Route path='/reset' element={<Reset/>}/>
        <Route path='/updateuser/:id' element={<Updateuser/>}/>
        <Route path='/user' element={<User/>}/>
        <Route path='/update/:userid/:taskid' element={<Updatetask/>}/>
        <Route path='/status/:id' element={<Statusupdate/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/addtask' element={<Addtask/>}/>
        <Route path="/showtask/:userId" element={<ShowTask />} />
        <Route path='/oneuser' element={<Oneuser/>}/>
        <Route path='/forget' element={<Forget/>}/>
        <Route path='/signup' element={<Singup/>}/>
         <Route path='/center' element={
          <ProtectedRoute>
          <Center/>
          </ProtectedRoute>}/>
         <Route path='/table' element={
          <ProtectedRoute>
          <Table/>
          </ProtectedRoute>
          }/>
         <Route path='/calender' element={
          <ProtectedRoute>
          <Calender/>
          </ProtectedRoute>
          }/>
         <Route path='/dashboard' element={
          <ProtectedRoute>
          <Dashboard/>
          </ProtectedRoute>
          }/>

      </Routes>
      
    </>
  )
}

export default App
