const mentor = require("../models/mentor");


exports.mentorDetails = async (req,res)=>{
    
    try {
        
        const mentorMail = req.user.mentorMail
        const mentorDetails = await mentor.findOne(mentorMail).populate('mentees', 'name email_id fatherContact createdAt lastKnownLocation');

        if(mentorDetails){
            return res.status(200).json({
                success:true,
                message:"mentor details found",
                mentorDetails
            })
        }else{
            return res.status(401).json({
                success:true,
                message:"mentor details not found login again"
            })
        }


    } catch (error) {
        return res.status(500).json({
            success:false,
            error
        })
    }
}

exports.updateMentorDetails = async (req,res)=>{

    try {
        
        const mentorEmail = req.user.email;
    
        const mentorData = await mentor.findOne({email:mentorEmail});

        if(!mentorData){
            return res.status(400).json({
                message:"mentor data not found"
            })
        }

        const {name,email,contactNumber,image,room,block,campus} = req.body;

        mentorData.name = name ?? mentorData.name;
        mentorData.email = email ?? mentorData.email;
        mentorData.contactNumber = contactNumber ?? mentorData.contactNumber;
        mentorData.image = image ?? mentorData.image;

        mentorData.officeAddress.room = room ?? mentorData.officeAddress.room;
        mentorData.officeAddress.block = block ?? mentorData.officeAddress.block;
        mentorData.officeAddress.campus = campus ?? mentorData.officeAddress.campus;

        await mentorData.save()

        return res.status(200).json({
            message:"mentor updated success"
        })

    } catch (error) {
        
        return res.status(500).json({
            error,
            message:"some error occured during update",
        })

    }
}