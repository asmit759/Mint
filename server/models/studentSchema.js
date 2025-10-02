const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
    roll_no: {
        type: Number,
        minLength: 7,
        maxLength: 9,
        default: null
    },
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 20
    },
    email_id: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        immutable: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18, 
        max: 99,
        default: null
    },
    dob: {
        type: Date,
        default: null
    },
    address: [
        {
            street: {
                type: String,
                minLength: 5,
                maxLength: 40,
                default: ""
            },
            city: {
                type: String,
                minLength: 5,
                maxLength: 10,
                default: ""
            },
            pincode: {
                type: Number,
                min: 100000, 
                max: 999999,
                default: null
            },
            state: {
                type: String,
                minLength: 3,
                maxLength: 20,
                default: ""
            },
            country: {
                type: String,
                minLength: 5,
                maxLength: 30,
                default: ""
            }
        }
    ],
    profilePhotoUrl: {
        type: String,
        default: ""
    },
    semester: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8],
        default: 1
    },
    branch: {
        type: String,
        enum: ['CSE', 'ME'],
        default: 'CSE'
    },
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'Hostel',
        default: null
    },
    room_no: {
        type: String,
        minLength: 3,
        maxLength: 6,
        unique: true,
        default: null
    },

    mentor: {
        type: Schema.Types.ObjectId,
        ref: "mentor",
        unique: true,
        default: null
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "parent",
        default: null
    }
}, { timestamps: true });

const Student = mongoose.model('studentModel', studentSchema);
module.exports = Student;
