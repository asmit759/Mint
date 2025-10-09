const mongoose = require("mongoose");
const {Schema} = mongoose;

const HostelSchema = new Schema ({
    hostelIncharge:{
            type:Schema.Types.ObjectId,
            ref:'mentor'
    },
    hostelAccess:{
        type:String,
        Length:6,
        required:true
    },
    hostelName:{
        type:String,
        minLength:3,
        maxLength:30  
    },
    hostelAddress:[
        {
            street: {
                type: String,
                minLength: 5,
                maxLength: 70
            },
            city: {
                type: String,
                default: "India",
                trim: true,
            },
            pincode: {
                type: Number,
                min: 100000, 
                max: 999999
            },
            latitude:{
                type:Number,
            },
            longitude:{
                type:Number
            }
        }
    ],
    hostelContact:{
        type:Number,
        minLength:10,
        maxLength:10,
    },
    hostelEmail:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        immutable: true
    },
    messContact:{
        type:Number,
        minLength:10,
        maxLength:10
    },
    messService: {
        type: String,
        minLength:5,
        maxLength:20
    }

},{timestamps:true});

const Hostel = mongoose.model('hostel',HostelSchema);
module.exports = Hostel

