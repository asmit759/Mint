
const  jwt = require("jsonwebtoken")
const adminMid = async(req,res,next)=>{
    try{

        const {token} = req.cookies;
        if(!token){
          return res.status(401).json({ error: "Authorization token missing" });
        }

        const payload = jwt.verify(token,process.env.JWT_SERVER_KEY );
        const {role} = payload;

        if(role!='admin'){
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        req.admin = payload;
        next();
    }catch(err){
        res.status(500).json({ error: "Admin authentication failed" });
    }

}

module.exports = {adminMid};