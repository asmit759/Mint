const express = require("express");
const router = express.Router();
const multer = require("multer");

//controllers
const {alertStudent} = require("../controllers/mentorMail");
const { uploadAttendance } = require("../controllers/attendanceController");
const {getMenteeGrievances,resolveGrievance} = require("../controllers/grievanceController")
const {mentorDetails,updateMentorDetails} =require("../controllers/mentorDetails");
const {getAttendance} = require("../controllers/attendanceController")

//middlewares
const {mentorMid, isMentor} = require("../middleware/mentorMid");

router.post("/sendMailToStudent",mentorMid,isMentor,alertStudent);


const upload = multer({ dest: "uploads/" });
router.post("/uploadAttendance", upload.single("file"), uploadAttendance); // later add it to admin routes


// Mentor Student Routes

// get all greivance for my student
router.get('/viewAll',mentorMid,isMentor,getMenteeGrievances);

// resolve a greivance
router.post("/resolve", mentorMid,isMentor, resolveGrievance);

//getmentor
router.get("/getMentorDetails",mentorMid,isMentor, mentorDetails);

//update mentor
router.put("/updateMentor",mentorMid,isMentor,updateMentorDetails)

//getattendance
router.post("/getattendance",getAttendance);


module.exports = router;