import React, { useState } from 'react';
import { FiMessageSquare, FiHeart, FiFileText, FiHome, FiCheckSquare, FiLogOut } from 'react-icons/fi';

// This component expects a 'student' object prop with 'name' and 'profilePhotoUrl'
const StudentLanding = ({ student }) => {
  const [hovered, setHovered] = useState(null);

  const options = [
    { id: 'kiit-bandhu', label: '[translate:KIIT Bandhu]', description: 'The student guideline chatbot', icon: <FiMessageSquare /> },
    { id: 'kiit-sage', label: '[translate:KIIT Sage]', description: 'The student mental health chatbot', icon: <FiHeart /> },
    { id: 'student-grievance', label: 'Student Grievance', description: 'Applying for student grievance', icon: <FiFileText /> },
    { id: 'hostel-mess-grievance', label: 'Hostel or Mess Grievance', description: 'Applying for mess or hostel grievance', icon: <FiHome /> },
    { id: 'leave-approval', label: 'Leave Approval', description: 'Applying for leave by the student', icon: <FiCheckSquare /> },
  ];

  const radius = 180; // The radius of the circle for the buttons

  return (
    <div className="relative overflow-hidden min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      
      {/* Animated Aurora Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-[40rem] h-[40rem] bg-indigo-800/40 rounded-full blur-[150px] animate-pulse-slow -top-20 -left-40"></div>
        <div className="absolute w-[30rem] h-[30rem] bg-purple-800/30 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000 bottom-0 -right-20"></div>
      </div>
      
      {/* Logout Button */}
      <button className="absolute top-6 right-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
        <FiLogOut />
        <span>Logout</span>
      </button>

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
          Welcome, {student?.name || 'Student'}
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Your central hub for university services and support.</p>
      </header>

      {/* Main Interactive Orb */}
      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Central Profile Image with Glow */}
        <div className="absolute w-52 h-52 md:w-56 md:h-56 rounded-full border-4 border-indigo-500/80 shadow-[0_0_40px_8px_rgba(99,102,241,0.5)] overflow-hidden">
          <img
            src={student?.profilePhotoUrl || 'https://i.pravatar.cc/300'}
            alt="Student Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Orbiting Option Buttons */}
        {options.map((option, i) => {
          const angle = (i / options.length) * 2 * Math.PI - (Math.PI / 2); // Start from top-center
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <button
              key={option.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`w-64 flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 transform
                ${hovered === i 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 border-indigo-500 scale-110 z-10' 
                  : 'bg-gray-900/70 backdrop-blur-sm text-gray-300 border-indigo-800/30 hover:border-indigo-600'
                }`}
            >
              <div className={`text-2xl transition-colors ${hovered === i ? 'text-white' : 'text-indigo-400'}`}>
                {option.icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-md">{option.label}</h3>
                <p className={`text-sm ${hovered === i ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      
    </div>
  );
};

export default StudentLanding;

