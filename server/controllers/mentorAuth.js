require ("dotenv").config();
const mentor = require("../models/mentor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.mentorRegister = async (req,res) =>{
    try {
        
        const {
            name,
            email,
            contactNumber,
            password,
            confirmPassword,
            accountType,
            //otp
        } = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword dont match"
            })
        }

        //check for existing user
        const existingUser = await mentor.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist LOGIN"
            })
        }

        //otp bad mai dalenge

        

        const hashedPassword = await bcrypt.hash(password,10);

        const registerMentor = await mentor.create({
            name,
            email,
            contactNumber,
            password:hashedPassword,
            accountType:accountType,
        })

        return res.status(200).json({
            success:true,
            registerMentor,
            message:"Mentor register Success"
        });
    
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success:false,
            message:"User unable to register try again later",
            error: error.message 
        });
    }
}


//LOGIN MENTOR
exports.mentorLogin = async(req,res)=>{
    try {
        
        const {email,password} = req.body;

        const findMentor = await mentor.findOne({email});

        if(!findMentor){
            return res.status(400).json({
                success:false,
                message:"mentor not found try signup first"
            });
        }

        if(await bcrypt.compare(password,findMentor.password)){
            const token = jwt.sign(
                {email:findMentor.email, id:findMentor._id, accountType:findMentor.accountType},
                process.env.JWT_SERVER_KEY,
                { expiresIn: "48h" }
            );

            findMentor.token = token;
        findMentor.password = undefined;


        //cookie
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            
        }

        res.cookie("token-cookie", token , options).status(200).json({
            success:true,
            token,
            findMentor,
            message:"Mentor Login Success"
        });
        
        }else{
            return res.status(401).json({
                success:false,
                message:"password is incorrect try again"
            })
        }
        

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success:false,
            message:"Login failed try again later"
        })
    }
}