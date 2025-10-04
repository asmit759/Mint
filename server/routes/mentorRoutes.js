const express = require("express");
const router = express.Router();
const multer = require("multer");

//controllers
const {alertStudent} = require("../controllers/mentorMail");
const { uploadAttendance } = require("../controllers/attendanceController");

//middlewares
const {mentorMid, isMentor} = require("../middleware/mentorMid");

router.post("/sendMailToStudent",mentorMid,isMentor,alertStudent);





const upload = multer({ dest: "uploads/" });
router.post("/uploadAttendance", upload.single("file"), uploadAttendance); // later add it to admin routes


module.exports = router;