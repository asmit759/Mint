const express = require("express");
const router = express.Router();

const {alertStudent} = require("../controllers/mentorMail");


router.post("/sendMailToStudent",alertStudent);

module.exports = router;