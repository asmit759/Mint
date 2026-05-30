const mongoose = require("mongoose");

const attendanceShareSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentModel",
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mentor",
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    overallAttendance: {
        type: String, // String to handle percentages like "87.5%"
        required: true
    },
    attendanceDetails: {
        type: Array, // Flexible array to store subject-wise details
        required: true
    },
    sharedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// TTL index to automatically delete the document when expiresAt is reached
attendanceShareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("AttendanceShare", attendanceShareSchema);
