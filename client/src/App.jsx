import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages/Components
import Login from "./components/Login";
import StudentSignup from "./components/StudentSignup";
import StudentLanding from "./components/student/Landing";
import MentorSignup from "./components/MentorSignup";
import MentorNavbar from "./components/mentor/MentorNavbar";
import MentorLand from './components/mentor/MentorLand';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/landing" element={<StudentLanding />} />
        <Route path="/mentor/signup" element={<MentorSignup />} />
        <Route path="/mentor-landing" element={<><MentorLand/></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
