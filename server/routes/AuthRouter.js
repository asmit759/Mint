const express = require("express");
const AuthRouter = express.Router();
const {Login,Logout, Register} = require("../controllers/Auth");


AuthRouter.post("/login",Login);
AuthRouter.post("/register",Register);
AuthRouter.post("/logout",Logout);


module.exports = AuthRouter;