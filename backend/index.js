const express = require('express')
const cookieParser = require("cookie-parser");
const app =  express()

require('dotenv').config()
const PORT = process.env.PORT || 3000

app.use(cookieParser());

app.use(express.json())

require("./config/database").connect();

//Route import and Mount
const user = require("./routes/user")
app.use("/api/v1",user);

app.listen(PORT,() =>{
    console.log(`Server started at port ${PORT}`);
})