const express = require("express");
const adminRouter = express.Router();
const {adminMid} = require("../middleware/adminMiddleware");
const {adminLogin} = require('../controllers/adminControllers')
const {createHostel,getAllHostels,getHostelById} = require("../controllers/hostelControllers");


adminRouter.post("/Login",adminLogin),


adminRouter.post("/createHostel",adminMid,createHostel);
adminRouter.get("/allHostels",adminMid, getAllHostels);
adminRouter.get("/hostel/:id",adminMid, getHostelById);

module.exports = adminRouter;
