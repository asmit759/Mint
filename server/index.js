const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cors = require("cors");


const studentAuthRouter = require("./routes/studentAuthRouter");
const studRouter = require("./routes/studentRouter");
const mentorAuthRouter = require("./routes/mentorAuthRouter");
const mentorRoutes = require("./routes/mentorRoutes");
const leaveRouter= require('./routes/leaveRouter');
const locationRoutes = require("./routes/locationRoutes");
const adminRouter = require("./routes/adminRoutes");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"https://localhost:5173",
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))


// Routes
app.use("/student",studentAuthRouter)
app.use("/mentor",mentorAuthRouter)

app.use("/studentFacility",studRouter);
app.use("/mentorRoutes",mentorRoutes);

app.use("/admin",adminRouter)

// Leave
app.use("/leave",leaveRouter);

//location
app.use("/location", locationRoutes);

const initCon = async ()=>{
    try{
        console.log("Mongo URI:", process.env.MONGO_CONNECT);

        await main();

        console.log("MongoDB Connected");

        const PORT = process.env.PORT || 4000;
        app.listen(PORT,()=>{
            console.log(`Server Running At Port : ${PORT} `)
        })

    }catch(error){
        console.log("Error in Server Connection"+error);

    }
}

initCon()

