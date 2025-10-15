// App.jsx
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./components/Login"
import StudentSignup from "./components/StudentSignup"
import MentorSignup from "./components/MentorSignup"
import MentorNavbar from './components/mentor/MentorNavbar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/mentor/signup" element={<MentorSignup />} />
      </Routes>


      {/* mentor */}
      <Routes>
        <Route path="/mentor-landing"  element={<MentorNavbar/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
