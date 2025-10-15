const mentor = require("../models/mentor");


exports.mentorDetails = async (req,res)=>{
    
    try {
        
        const mentorMail = req.user.mentorMail
        const mentorDetails = await mentor.findOne(mentorMail);
        console.log(mentorDetails);

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