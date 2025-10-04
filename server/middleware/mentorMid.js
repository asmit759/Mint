const jwt = require("jsonwebtoken");
require("dotenv").config();
const mentor = require("../models/mentor");

exports.mentorMid = async(req,res,next)=>{

    try {
        
        //geting the token
        const token = req.cookies.token || req.body.token

        if(!token){

            return res.status(401).json({
                success:false,
                messsage:"Token is missing...login first"
            });

        }
        try {
            
            const decode = jwt.verify(token,process.env.JWT_SERVER_KEY);
            console.log(decode);
            req.user = decode;

        } catch (err) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
            error:error
        });
    }

}


//use the token generated to verify the mentor

exports.isMentor = async(req,res,next)=>{
    try {
        
        if(req.user.accountType !== "Mentor"){
            return res.status(401).json({
                success:false,
                message:"This route is protected for Mentor only"
            })
        }
        next();

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Unable to verify accountType try again later"
        })
    }
}