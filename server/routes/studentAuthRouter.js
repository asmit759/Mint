const express = require("express");
const studentAuthRouter = express.Router();
const {studentLogin,studentLogout,studentRegister} = require("../controllers/studentAuth");

const {studMid} = require("../middleware/studentMiddleware")


studentAuthRouter.post("/login",studentLogin);
studentAuthRouter.post("/register",studentRegister);
studentAuthRouter.post("/logout",studMid,studentLogout);


module.exports = studentAuthRouter;