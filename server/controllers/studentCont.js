
const Student = require("../models/studentSchema");
const mentor = require("../models/mentor");
const Hostel = require("../models/hostelSchema");
const AttendanceShare = require("../models/attendanceShareSchema");

const getStud = async(req,res)=>{

    try{
        const id = req.result.id;
        if(!id)throw new Error("Student ID is unavailable");

        const student = await Student.findById(id);
        
        res.status(200).json({
            message:"Student Fetched Successully",
            student:student
        }) 
    }catch(err){

        res.status(500).send("Error fetching Student Data");

    }

}

const getMentor = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        if (!student.mentor) {
            return res.status(404).json({ message: "Mentor not assigned" });
        }

        const ment = await mentor.findById(student.mentor);
        if (!ment) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        res.status(200).json({
            message: "Mentor details fetched successfully",
            ment
        });
    } catch (err) {
        res.status(500).send("Error fetching Mentor: " + err.message);
    }
};

const getParent = async (req, res) => {
    try {
        const { id } = req.params; 
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        if (!student.fatherName && !student.motherName && !student.parentEmail) {
            return res.status(404).json({ message: "Parent details not updated" });
        }
        const parentDetails = {
            fatherName: student.fatherName || null,
            fatherContact: student.fatherContact || null,
            motherName: student.motherName || null,
            motherContact: student.motherContact || null,
            parentEmail: student.parentEmail || null
        };

        res.status(200).json({
            message: "Parent details fetched successfully",
            parent: parentDetails
        });

    } catch (err) {
        res.status(500).send("Error fetching parent details: " + err.message);
    }
};


const studUpdate = async (req, res) => {
    try {
        const id = req.result.id;
        const { profilePhotoUrl } = req.body;
        
        if (!profilePhotoUrl) {
            return res.status(400).json({ message: "Only profile photo can be updated." });
        }

        const updated = await Student.findByIdAndUpdate(id, { profilePhotoUrl }, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Profile photo updated successfully",
            student: updated
        });
    } catch (err) {
        res.status(500).send("Error updating Student: " + err.message);
    }
};

// Hostel Details

const hostelDetails = async(req,res)=>{
    try{
        const id = req.result.id;
        if(!id)
        {
            throw new Error("Student ID is unavailable")
        }

        const student = await Student.findById(id);
        const hostelId = student.hostel;

        if(!hostelId){
            throw new Error("Student Hostel Details Not Available");
        }

        const hostel = await Hostel.findById(hostelId);
        res.status(200).json({
            message:"Student hostel Fetched Successully",
            hostel:hostel
        })

    }catch(err){
        res.status(500).send("Error fetching Student Data");
    }
}

const shareAttendance = async (req, res) => {
    try {
        const id = req.result.id;
        const { overallAttendance, attendanceDetails } = req.body;

        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        if (!student.mentor) return res.status(404).json({ success: false, message: "Mentor not assigned" });

        const mentorId = student.mentor;
        const studentName = student.name;
        const rollNumber = student.roll_no;
        
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours from now

        let record = await AttendanceShare.findOne({ studentId: id });
        if (record) {
            record.overallAttendance = overallAttendance;
            record.attendanceDetails = attendanceDetails;
            record.sharedAt = Date.now();
            record.expiresAt = expiresAt;
            await record.save();
        } else {
            record = await AttendanceShare.create({
                studentId: id,
                mentorId,
                studentName,
                rollNumber,
                overallAttendance,
                attendanceDetails,
                expiresAt
            });
        }

        res.status(200).json({ success: true, message: "Attendance shared successfully", data: record });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error sharing attendance: " + err.message });
    }
};

module.exports = {getStud,getMentor,getParent,hostelDetails,studUpdate,shareAttendance};