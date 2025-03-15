import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import {Home} from './pages/Home'
import {LoginForm} from './pages/Login'
import {SignupForm} from './pages/SignUp'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  )
}

export default App
