const Student = require("../models/studentSchema");
const mentor = require("../models/mentor");

exports.shareLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const studid = req.result._id;

        if (!studid || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Some fields are missing. Please provide all required data.",
            });
        }

        // Update student's last known location
        const student = await Student.findByIdAndUpdate(
            studid,
            {
                lastKnownLocation: { latitude, longitude, timestamp: new Date() },
            },
            { new: true }
        );

        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const mentorId = student.mentor;

        // Update mentee location in mentor's document
        const mDoc = await mentor.findById(mentorId);
        if (!mDoc) {
            return res.status(404).json({
                success: false,
                message: "Mentor not found for this student.",
            });
        }

        const entry = mDoc.menteeLocation.find(
            (x) => x.menteeName === student.name
        );

        if (entry) {
            entry.location = mapUrl;
            entry.updatedAt = new Date();
        } else {
            mDoc.menteeLocation.push({
                menteeName: student.name,
                location: mapUrl,
                updatedAt: new Date(),
            });
        }

        await mDoc.save();

        return res.status(200).json({
            success: true,
            message: "Location shared successfully",
            mapUrl,
            mDoc,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating location data",
            error: error.message,
        });
    }
};


exports.getStudentLocation = async (req, res) => {
    try {
        const { studentEmail } = req.query;
        const student = await Student.findOne({ email_id: studentEmail });

        if (!student || !student.lastKnownLocation) {
            return res.status(404).json({
                success: false,
                message: "Location not found for this student",
            });
        }

        const { latitude, longitude } = student.lastKnownLocation;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        return res.status(200).json({
            success: true,
            message: "Map displayed successfully",
            mapUrl,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching student location",
            error: error.message,
        });
    }
};
