
const Hostel = require("../models/hostelSchema");
const Student= require("../models/studentSchema")

const generateAccessKey = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createHostel = async (req, res) => {
  try {
    const {
      hostelIncharge,
      hostelName,
      hostelAddress,
      hostelContact,
      hostelEmail,
      messContact,
      messService
    } = req.body;
    if (!hostelName || !hostelEmail) {
      return res.status(400).json({ error: "Hostel name and email are required" });
    }
    let hostelAccess = generateAccessKey();
    let existing = await Hostel.findOne({ hostelAccess });
    while (existing) {
      hostelAccess = generateAccessKey();
      existing = await Hostel.findOne({ hostelAccess });
    }
    const newHostel = await Hostel.create({
      hostelIncharge,
      hostelAccess,
      hostelName,
      hostelAddress,
      hostelContact,
      hostelEmail,
      messContact,
      messService
    });

    res.status(201).json({
      message: "Hostel created successfully",
      hostel: newHostel
    });

  } catch (error) {
    console.error("Error creating hostel:", error);
    res.status(500).json({ error: "Failed to create hostel" });
  }
};

const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate("hostelIncharge", "name email");
    res.status(200).json({ hostels });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hostels" });
  }
};

const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hostel = await Hostel.findById(id).populate("hostelIncharge", "name email");

    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    res.status(200).json({ hostel });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hostel" });
  }
};


const studentHostel= async (req, res) => {
  try {
    const { hostelId, rollNumbers } = req.body;

    if (!hostelId || !Array.isArray(rollNumbers) || rollNumbers.length === 0) {
      return res.status(400).json({
        message: "hostelId and rollNumbers array are required"
      });
    }

    const hostelData = await Hostel.findById(hostelId);
    if (!hostelData) {
      return res.status(404).json({
        message: "Hostel not found"
      });
    }

    const result = await Student.updateMany(
      { roll_no: { $in: rollNumbers } },
      { $set: { hostel: hostelId } }
    );

    res.status(200).json({
      message: "Students successfully mapped to hostel",
      hostel: hostelData.hostelName,
      studentsUpdated: result.modifiedCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error mapping students to hostel",
      error
    });
  }
};



module.exports = {createHostel,getAllHostels,getHostelById,studentHostel}
