const express = require("express");
const studentAuthRouter = express.Router();
const {studentLogin,studentLogout,studentRegister} = require("../controllers/studentAuth");


studentAuthRouter.post("/login",studentLogin);
studentAuthRouter.post("/register",studentRegister);
studentAuthRouter.post("/logout",studentLogout);


module.exports = studentAuthRouter;