const mongoose = require("mongoose");

async function main(){
    await mongoose.connect(process.env.MONGO_CONNECT,{
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("DB Connected Success"))
    .catch((error)=>{
        console.log("DB Connection failed");
        console.log(error);
        process.exit(1);
    })
}

module.exports = main