// App.jsx
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./components/Login"
import StudentSignup from "./components/StudentSignup"
import MentorSignup from "./components/MentorSignup"
import StudentLanding from './components/student/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/landing" element={<StudentLanding/>} />
        <Route path="/mentor/signup" element={<MentorSignup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
