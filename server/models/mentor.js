const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            reqired:true,
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        contactNumber:{
            type:Number,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        token:{
            type:String
        },
        image:{
            type:String
        },
        accountType:{
            type:String,
            required:true,
            default:"Mentor"
        },
        mentees:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"studentModel"
            }
        ],
        officeAddress:{
            room:{
                type:String,
            },
            block:{
                type:String
            },
            campus:{
                type:String
            }
        }  ,
        
        parent:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"parent"
        },

        
        
    },

    { timestamps: true }
);

module.exports = mongoose.model("mentor",mentorSchema);