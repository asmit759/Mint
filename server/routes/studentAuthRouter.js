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
        id:req.result._id
    }
    res.status(201).json({
        user:reply,
        message:"Valid User"
    })
})


module.exports = studentAuthRouter;