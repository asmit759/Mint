const express = require('express');
const leaveRouter = express.Router();
const {studMid}= require("../middleware/studentMiddleware");
const {mentorMid,isMentor}= require("../middleware/mentorMid")
const {requestLeave,renderParentForm,verifyParentApproval,approveLeave,getLeaves} = require("../controllers/leaveController")

leaveRouter.post("/createLeave",studMid,requestLeave);
leaveRouter.get("/parent-form",renderParentForm);
leaveRouter.post("/verify-parent",verifyParentApproval);
leaveRouter.post("/approve-leave-mentor",mentorMid,isMentor,approveLeave);

leaveRouter.get("/pending-leaves",getLeaves)

module.exports = leaveRouter