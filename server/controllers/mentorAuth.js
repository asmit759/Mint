
const mentor = require("../models/mentor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// controllers/mentorAuth.js
exports.mentorRegister = async (req, res) => {
  try {
    const { name, email, contactNumber, password, confirmPassword, accountType } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Password and ConfirmPassword dont match" });
    }

    const existingUser = await mentor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exist LOGIN" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const m = await mentor.create({
      name,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
    });

    const user = {
      id: m._id,
      name: m.name,
      email: m.email,
      contactNumber: m.contactNumber,
      accountType: m.accountType,
    };

    return res.status(200).json({
      success: true,
      user,                
      message: "Mentor register Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User unable to register try again later",
      error: error.message,
    });
  }
};





exports.mentorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const m = await mentor.findOne({ email }).select("+password");
    if (!m) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, m.password);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { email: m.email, id: m._id, accountType: m.accountType },
      process.env.JWT_SERVER_KEY,
      { expiresIn: "48h" }
    );

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    const user = {
      id: m._id,
      name: m.name,
      email: m.email,
      contactNumber: m.contactNumber,
      accountType: m.accountType,
    };

    return res.status(200).json({ success: true, user, message: "Mentor Login Success" });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message || "Login failed" });
  }
};

exports.mentorLogout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
      expires: new Date(0),
    });

    res.status(200).json({ success: true, message: "Logout Successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Logout failed" });
  }
};
