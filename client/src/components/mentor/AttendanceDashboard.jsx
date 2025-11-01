import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mentorLogout, logout } from "../../store/authSlice";
import MentorNavbar from "./MentorNavbar";

const AttendanceDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const res = await axios.get("https://mint-backend-p3hv.onrender.com/mentorRoutes/getMentorDetails", {
          withCredentials: true,
        });
        setMentees(res.data.mentorDetails.mentees || []);
      } catch (err) {
        console.error("Error fetching mentor details:", err);
      }
    };
    fetchMentorDetails();
  }, []);

 
  const handleFetchAttendance = async () => {
    if (!selectedEmail) return;
    try {
      setLoading(true);
      const res = await axios.post("https://mint-backend-p3hv.onrender.com/mentorRoutes/getAttendance", {
        studentEmail: selectedEmail,
      });
      setAttendanceData(res.data.attendanceData);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(mentorLogout()).unwrap();
    } catch {
      dispatch(logout());
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950">
      <MentorNavbar onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaCalendarCheck className="h-6 w-6 text-white"/>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                Mentor Attendance Dashboard
              </h2>
            </div>
            <p className="text-indigo-300/70 text-sm ml-15">Track and monitor student attendance records</p>
          </div>
        </div>

        {/* Selection Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 shadow-2xl mb-6">
          <label className="block text-indigo-300 font-semibold mb-3 text-sm uppercase tracking-wide">
            Select Student
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <select
                className="w-full bg-gray-900/50 border border-indigo-500/30 text-white rounded-xl px-4 py-3.5 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           hover:border-indigo-400/50 transition-all duration-200 appearance-none cursor-pointer"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              >
                <option value="" className="bg-gray-900">-- Select a Mentee --</option>
                {mentees.map((mentee) => (
                  <option key={mentee._id} value={mentee.email_id} className="bg-gray-900">
                    {mentee.name} ({mentee.email_id})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleFetchAttendance}
              disabled={!selectedEmail || loading}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500
                         text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                         transition-all duration-200 transform hover:scale-105 active:scale-95
                         flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Get Attendance</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Attendance Display */}
        {attendanceData && (
          <div className="space-y-6">
            {/* Student Info Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{attendanceData.studentEmail}</h3>
                  <p className="text-indigo-300 text-sm">{attendanceData.course}</p>
                </div>
              </div>
            </div>

            {/* Academic Year Cards */}
            {attendanceData.attendance.map((yearObj) => (
              <div key={yearObj._id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  <h4 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
                    Academic Year {yearObj.year}
                  </h4>
                </div>

                {yearObj.semesters.map((sem) => (
                  <div key={sem._id} className="bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Semester Header */}
                    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-indigo-500/20 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                        <h5 className="text-lg font-bold text-indigo-300 uppercase tracking-wide">
                          Semester: {sem.semester}
                        </h5>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Faculty</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-indigo-300 uppercase tracking-wider">Total Days</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-indigo-300 uppercase tracking-wider">Present</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-indigo-300 uppercase tracking-wider">Absent</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-indigo-300 uppercase tracking-wider">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-500/10">
                          {sem.subjects.map((subj) => (
                            <tr 
                              key={subj._id} 
                              className="hover:bg-indigo-900/20 transition-colors duration-150"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                  <span className="text-white font-medium">{subj.subject}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-indigo-200 text-sm">{subj.facultyName}</td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-indigo-300 font-semibold">{subj.totalDays}</span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-lg font-bold">
                                  {subj.present}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center justify-center w-10 h-10 bg-rose-500/20 text-rose-400 rounded-lg font-bold">
                                  {subj.absent}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span
                                  className={`inline-flex items-center px-4 py-2 rounded-xl font-bold text-sm shadow-lg
                                    ${
                                      subj.percentage >= 75
                                        ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30"
                                        : subj.percentage >= 50
                                        ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30"
                                        : "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-400 border border-rose-500/30"
                                    }`}
                                >
                                  {subj.percentage}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && attendanceData === null && selectedEmail && (
          <div className="bg-black/40 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-rose-400 mb-2">No Attendance Found</h3>
            <p className="text-rose-300/60">No attendance data available for this student.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;
