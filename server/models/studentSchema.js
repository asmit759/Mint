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
    avatarSeed: {
        type: String,
        default: ""
    },
    email_id: {
        type: String,
        required: true,
        unique:true,
        trim: true,
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
    attendance:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Attendance"
    },
    address: [
        {
            street: { type: String, minLength: 5, maxLength: 40, default: "" },
            city: { type: String, minLength: 5, maxLength: 10, default: "" },
            pincode: { type: Number, min: 100000, max: 999999, default: null },
            state: { type: String, minLength: 3, maxLength: 20, default: "" },
            country: { type: String, minLength: 5, maxLength: 30, default: "" }
        }
    ],
    profilePhotoUrl: { type: String, default: "" },
    semester: { type: Number, enum: [1,2,3,4,5,6,7,8], default: 1 },
    branch: { type: String, enum: ['CSE','ME'], default: 'CSE' },
    hostel: { type: Schema.Types.ObjectId, ref: 'Hostel', default: null },
    room_no: { type: String, minLength: 3, maxLength: 6, default: null },
    mentor: { type: Schema.Types.ObjectId, ref: "mentor" },
    fatherName: { type: String, minLength: 5, maxLength: 20 },
    fatherContact: { type: Number, min: 1000000000, max: 9999999999 },
    motherName: { type: String, minLength: 5, maxLength: 20 },
    motherContact: { type: Number, min: 1000000000, max: 9999999999 },
    parentEmail: { type: String, trim: true, lowercase: true },


  lastKnownLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    timestamp: { type: Date, default: Date.now }, 
  }
}, { timestamps: true });

// studentSchema.pre('findOneAndUpdate', async function(next) {
//     const update = this.getUpdate();
//     if (update.parentEmail) {
//         const docToUpdate = await this.model.findOne(this.getQuery());
//         if (docToUpdate.parentEmail) {
//             return next(new Error("parentEmail cannot be changed once it is set."));
//         }
//     }
//     next();
// });

const Student = mongoose.model('studentModel', studentSchema);
module.exports = Student;
