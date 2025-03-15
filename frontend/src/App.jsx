import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import {Home} from './pages/Home'
import {LoginForm} from './pages/Login'
import {SignupForm} from './pages/SignUp'
import { EmpLoginForm } from './pages/EmpLogin';
import { AdminLoginForm } from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login/employee" element={<EmpLoginForm />} />
        <Route path="/login/admin" element={<AdminLoginForm />} />
      </Routes>
    </Router>
  )
}

export default App
