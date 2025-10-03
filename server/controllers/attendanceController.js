const Attendance = require("../models/attendance");
const parseAttendanceExcel = require("../utils/attendanceParser");

exports.uploadAttendance = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    const academicYear = req.body.academicYear || "2025-26"; // hamesha as per year admin change karega to current year >> abhi 2025-26

    const attendanceData = parseAttendanceExcel(req.file.path, academicYear);


    const newRecord = await Attendance.create({

      studentId: req.body.studentId, // pass in request
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
