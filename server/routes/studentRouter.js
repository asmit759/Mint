const express = require("express");
const studRouter = express.Router();

const {studMid} = require("../middleware/studentMiddleware")
const {getStud,getMentor,getParent,studUpdate} = require("../controllers/studentCont")

const {callSage,callKIITBandhu} = require("../controllers/studentChatbots")


const {sendSMS} = require("../controllers/studentParentCnf");


// general CRUD Operations
studRouter.get("/studDetails",studMid,getStud);
studRouter.get("/studMentor/:id",getMentor);
studRouter.get("/studParent/:id",getParent);
studRouter.put("/studUpdateDetails",studMid,studUpdate);
// delete wala authority dena hai ki nhi discuss

// Chatbot Functionalities
studRouter.post("/studentMentalHealth",studMid,callSage);
studRouter.post("/studentGuide",studMid,callKIITBandhu);

// StudentMentor functionalties
// Grievance
// Leave Approval
studRouter.post("/parent-confirm",sendSMS);
// Mess Rating using GeoLocation
// Rate an item
// Grievance for hostel rating
// Grievance for room related Activities

module.exports = studRouter;