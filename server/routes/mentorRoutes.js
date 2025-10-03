const express = require("express");
const router = express.Router();
const multer = require("multer");

const {alertStudent} = require("../controllers/mentorMail");
const { uploadAttendance } = require("../controllers/attendanceController");

router.post("/sendMailToStudent",alertStudent);





const upload = multer({ dest: "uploads/" });
router.post("/uploadAttendance", upload.single("file"), uploadAttendance); 


module.exports = router;