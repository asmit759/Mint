const express = require("express");
const studRouter = express.Router();

const {studMid} = require("../middleware/studentMiddleware")
const {getStud,getMentor,getParent,studUpdate,hostelDetails} = require("../controllers/studentCont")
const {grievances,createGeoGrievance} = require("../controllers/grievanceController")
const {callSage,callKIITBandhu} = require("../controllers/studentChatbots");
const  mentorMid  = require("../middleware/mentorMid");


// general CRUD Operations
studRouter.get("/studDetails",studMid,getStud);
studRouter.get("/studMentor/:id",getMentor);
studRouter.get("/studParent/:id",getParent);
studRouter.put("/studUpdateDetails",studMid,studUpdate);
studRouter.get("/studentHostel",studMid,hostelDetails);

// delete wala authority dena hai ki nhi discuss

// Chatbot Functionalities
studRouter.post("/studentMentalHealth",studMid,callSage);
studRouter.post("/studentGuide",studMid,callKIITBandhu);

// StudentMentor functionalties
// Grievance
studRouter.post("/studentGrievance",studMid,grievances);

// Mess Grievance using GeoLocation
studRouter.post("/studentHostelGrievance",studMid,createGeoGrievance);


module.exports = studRouter;