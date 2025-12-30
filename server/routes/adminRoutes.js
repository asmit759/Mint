const express = require("express");
const adminRouter = express.Router();
const {adminMid} = require("../middleware/adminMiddleware");
const {adminLogin,assign} = require('../controllers/adminControllers')
const {createHostel,getAllHostels,getHostelById,studentHostel} = require("../controllers/hostelControllers");

// student
const {updateStudent}= require('../controllers/adminControllers');


adminRouter.post("/Login",adminLogin),


adminRouter.post("/createHostel",adminMid,createHostel);
adminRouter.get("/allHostels",adminMid, getAllHostels);
adminRouter.get("/hostel/:id",adminMid, getHostelById);

// admin update student details
adminRouter.put("/updateStudent",adminMid,updateStudent);
adminRouter.put("/assignHostel",adminMid,studentHostel)

//assign mentor-student
adminRouter.post("/assign",adminMid,assign);

module.exports = adminRouter;
