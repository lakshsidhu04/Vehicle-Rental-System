import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import {Home} from './pages/Home'
import {LoginForm} from './pages/Login'
import {SignupForm} from './pages/SignUp'
import { EmpLoginForm } from './pages/EmpLogin';
import { AdminLoginForm } from './pages/AdminLogin';
import { AdminVehicles } from './pages/Vehicles';
import { Bookings } from './pages/Bookings';
import AdminBookings from './pages/AdminBookings';
import EmployeeProfile from './pages/EmployeeProfile';
import AdminEmployees from './pages/AdminEmployees';
import BookingHistory from './pages/BookingHistory';
import CustomerProfile from './pages/CustomerProfile';
import { MaintenanceVehicles } from './pages/AdminMaintenance';
import AdminEarnings from './pages/Earnings';
import { Fines } from './pages/Fines';
import EmployeeMaintenance from './pages/EmployeeJob';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login/employee" element={<EmpLoginForm />} />
        <Route path="/login/admin" element={<AdminLoginForm />} />
        <Route path="/admin/vehicles" element={<AdminVehicles />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/admin/all-bookings" element={<AdminBookings />} />
        <Route path="/employee/:id" element={<EmployeeProfile />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/admin/maintenance" element={<MaintenanceVehicles />} />
        <Route path="/admin/earnings" element={<AdminEarnings/>} />
        <Route path="/bookings/history" element={<BookingHistory />} />
        <Route path="/customer/:id" element={<CustomerProfile />} />
        <Route path="/fines" element={<Fines />} />
        <Route path="/employee/maintenance" element={<EmployeeMaintenance />} />
      
      </Routes>
    </Router>
  )
}

export default App
