const express = require("express");
const studRouter = express.Router();

const {studMid} = require("../middleware/studentMiddleware")
const {getStud,getMentor,getParent,studUpdate} = require("../controllers/studentCont")
const {grievances} = require("../controllers/grievanceController")
const {callSage,callKIITBandhu} = require("../controllers/studentChatbots")


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
studRouter.post("/studentGrievance",studMid,grievances);

// Mess Grievance using GeoLocation
// studRouter.post("/studentMessGrievance",studMid,messGriev);

// Grievance for hostel & room 
// studRouter.post("/studentRoomGrievance",studMid,roomGriev);

module.exports = studRouter;