const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");


const AuthRouter = require("./routes/AuthRouter");

app.use(express.json());
app.use(cookieParser);

// Routes
app.use("/user",AuthRouter)


const initCon = async ()=>{
    try{
        await main();

        console.log("Mongo DB Connected");

        app.listen(process.env.PORT,()=>{
            console.log(`Server Running At Port : ${process.env.PORT} `)
        })

    }catch(error){
        console.log("Error in Server Connection"+error);

    }
}

initCon()

