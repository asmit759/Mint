const express = require("express");
const router = express.Router();
const {studMid} = require("../middleware/studentMiddleware")


const { shareLocation, getStudentLocation } = require("../controllers/locationController");




// student shares current location and store it in its own databsae 
router.post("/share-location",studMid, shareLocation);

// mentor fetches student’s last known location
router.get("/get-location/:studentId", getStudentLocation);

module.exports = router;
