const Attendance = require("../models/attendance");
const parseAttendanceExcel = require("../utils/attendanceParser");
const Student = require("../models/studentSchema");

exports.uploadAttendance = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    const academicYear = req.body.academicYear || "2025-26"; // hamesha as per year admin change karega to current year >> abhi 2025-26

    const attendanceData = parseAttendanceExcel(req.file.path, academicYear);


    const newRecord = await Attendance.create({

      studentId: req.body.studentId, // pass in request
      studentEmail:req.body.studentEmail,
      attendance: [attendanceData],


    });
  
    

    return res.status(201).json({ 

      success: true,
      message: "Attendance uploaded successfully",
      data: newRecord,

    }
  );





  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to upload attendance",
      error: error.message,
    });

    
  }
};




exports.getAttendance = async (req,res) => {

  try {
    
    const studentEmail = req.body;

    if(!studentEmail){
      return res.status(401).json({
        success:false,
        message:"email not passed"
      })
    }

    const attendanceData = await Attendance.findOne(studentEmail);

    if(!attendanceData){
      return res.status(400).json({
        success:false,
        message:"not found attendance for the student"

      })
    }

    res.status(200).json({
      success:true,
      message:"found the attendance",
      attendanceData
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }

}