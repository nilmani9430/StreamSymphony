const bcrypt = require('bcrypt')
const User = require("../models/user");
// const user = require('../models/user');
const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.signup = async (req,res) => {
    try{
        const {name,email,password}= req.body;
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: 'User alrady exist'
            });
        }

        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:"Error in hashing password"
            })
        }

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        })

        return res.status(200).json({
            success : true ,
            message:'User created successfully',
        })

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message: "User cannot be registered",
        })

    }
}

exports.login = async (req,res) => {
    try{
        //Data fetch
        const {email,password}=req.body;
        //Validation
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Please fill all the details carefully",
            })
        }
        
        let user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message: "User is not registerd",
            })
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }

        //verify password and Generate JWT token
        if(await bcrypt.compare(password,user.password)){
            //password match
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            
            user=user.toObject()
            user.token=token;
            user.password=undefined;

            const options = {
                expires: new Date(Date.now()+30000),
                httpOnly: true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                user,
                token,
                message: "User logged in successfully",
            })

            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message: "User Logged in Successfully"
            // })
            
        }
        else{
            //Password do not match
            return res.status(403).json({
                success:false,
                message: "Password Incorrect",
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message: "Login Failure",
        })
    }
}