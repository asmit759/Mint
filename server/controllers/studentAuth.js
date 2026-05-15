
const Student = require('../models/studentSchema')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validate= require("../utils/validator")

const studentRegister = async (req,res)=>{
    try {
        validate(req.body);
        const {email_id,name,password} = req.body;
        req.body.password= await(bcrypt.hash(password,10));
        const student = await Student.create(req.body);

        // const token = jwt.sign({_id:student._id,email_id:email_id,},process.env.JWT_SERVER_KEY,{expiresIn:60*60})
        // res.cookie('token',token,{maxAge:60*60*1000})
        const reply = {
            id:student._id,
            name:student.name,
            email_id:student.email_id,
            roll_no:student.roll_no,
            address:student.address,
            profilePhotoUrl:student.profilePhotoUrl,
            mentor:student.mentor,
            parent:student.parent,
        }

        res.status(200).json({
            message:"Registered Sucessfully",
            user:reply
        })
 
    }catch(error){
        res.status(404).send("Error:"+error);
    }
}

const studentLogin = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    if (!email_id || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const student = await Student.findOne({ email_id }).select("+password");
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPassed = await bcrypt.compare(password, student.password);
    if (!isPassed) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: student._id, email_id },
      process.env.JWT_SERVER_KEY,
      { expiresIn: 60 * 60 }
    );
    res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true,sameSite: "None",
      secure: true, });

    const reply = {
      id: student._id,
      name: student.name,
      email_id: student.email_id,
      roll_no: student.roll_no,
      address: student.address,
      profilePhotoUrl: student.profilePhotoUrl,
      mentor: student.mentor
    };

    // Use a consistent key: "user"
    return res.status(200).json({
      message: "Login Successfully",
      user: reply,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};


const studentLogout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    res.status(400).json({ message: error.message || "Logout failed" });
  }
};

module.exports = {studentLogin,studentLogout,studentRegister};

