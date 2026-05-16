const express = require("express");
const mentorAuthRouter = express.Router();
const {mentorLogin,mentorRegister, mentorLogout} = require("../controllers/mentorAuth");
const {mentorMid, isMentor} = require("../middleware/mentorMid");

mentorAuthRouter.post("/login",mentorLogin);
mentorAuthRouter.post("/register",mentorRegister);
mentorAuthRouter.post("/logout",mentorMid,mentorLogout);

mentorAuthRouter.get("/check",mentorMid,isMentor,async(req,res)=>{
    const reply ={
        name:req.user.name,
        email:req.user.email,
        id:req.user._id
    }
    res.status(200).json({
        success:true,
        user:reply,
        message:"Valid User"
    })
})



module.exports = mentorAuthRouter;