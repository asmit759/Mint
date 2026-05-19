const express = require("express");
const studentAuthRouter = express.Router();
const {studentLogin,studentLogout,studentRegister} = require("../controllers/studentAuth");

const {studMid} = require("../middleware/studentMiddleware")


studentAuthRouter.post("/login",studentLogin);
studentAuthRouter.post("/register",studentRegister);
studentAuthRouter.post("/logout",studMid,studentLogout);

studentAuthRouter.get("/check",studMid,async(req,res)=>{
    const reply ={
        name:req.result.name,
        email_id:req.result.email_id,
        id:req.result._id,
        roll_no:req.result.roll_no,
        address:req.result.address,
        profilePhotoUrl:req.result.profilePhotoUrl,
        mentor:req.result.mentor,
        age:req.result.age,
        semester:req.result.semester,
        branch:req.result.branch,
        hostel:req.result.hostel,
        room_no:req.result.room_no,
        fatherName:req.result.fatherName,
        fatherContact:req.result.fatherContact,
        motherName:req.result.motherName,
        motherContact:req.result.motherContact,
        parentEmail:req.result.parentEmail
    }
    res.status(201).json({
        user:reply,
        message:"Valid User"
    })
})


module.exports = studentAuthRouter;