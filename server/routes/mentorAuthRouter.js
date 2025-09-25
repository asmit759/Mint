const express = require("express");
const mentorAuthRouter = express.Router();
const {mentorLogin,mentorRegister} = require("../controllers/mentorAuth");


mentorAuthRouter.post("/login",mentorLogin);
mentorAuthRouter.post("/register",mentorRegister);


module.exports = mentorAuthRouter;