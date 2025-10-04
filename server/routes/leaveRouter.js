const express = require('express');
const leaveRouter = express.Router();
const {studMid}= require("../middleware/studentMiddleware");
const {mentorMid}= require("../middleware/mentorMid")
const {requestLeave,renderParentForm,verifyParentApproval,approveLeave} = require("../controllers/leaveController")

leaveRouter.post("/createLeave",studMid,requestLeave);
leaveRouter.get("/parentForm",renderParentForm);
leaveRouter.post("/verifyParent",verifyParentApproval);
leaveRouter.post("/approveLeaveMentor",mentorMid,approveLeave);

module.exports = leaveRouter