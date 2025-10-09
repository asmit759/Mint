const express = require("express");
const adminRouter = express.Router();
const {createHostel,getAllHostels,getHostelById} = require("../controllers/hostelControllers");


adminRouter.post("/createHostel",createHostel);
adminRouter.get("/allHostels", getAllHostels);
adminRouter.get("/hostel/:id", getHostelById);

module.exports = adminRouter;
