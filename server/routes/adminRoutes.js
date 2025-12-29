const express = require("express");
const adminRouter = express.Router();
const {adminMid} = require("../middleware/adminMiddleware");
const {adminLogin,assign} = require('../controllers/adminControllers')
const {createHostel,getAllHostels,getHostelById} = require("../controllers/hostelControllers");


adminRouter.post("/Login",adminLogin),


adminRouter.post("/createHostel",adminMid,createHostel);
adminRouter.get("/allHostels",adminMid, getAllHostels);
adminRouter.get("/hostel/:id",adminMid, getHostelById);

//assign mentor-student

adminRouter.post("/assign",adminMid,assign);

module.exports = adminRouter;
