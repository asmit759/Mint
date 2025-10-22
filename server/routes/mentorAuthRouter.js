const express = require("express");
const mentorAuthRouter = express.Router();
const {mentorLogin,mentorRegister} = require("../controllers/mentorAuth");
const {mentorMid, isMentor} = require("../middleware/mentorMid");

mentorAuthRouter.post("/login",mentorLogin);
mentorAuthRouter.post("/register",mentorRegister);


mentorAuthRouter.get("/check",mentorMid,isMentor,async(req,res)=>{
    const reply ={
        name:req.user.name,
        email:req.user.email,
        id:req.user._id
    }
    res.status(201).json({
        user:reply,
        message:"Valid User"
    })
})



module.exports = mentorAuthRouter;