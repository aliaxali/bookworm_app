import express from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
const router=express.Router()
const generateToken = (userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"})
}

router.post("/register",async (req,res)=>{
    try {
        const {email,username,password}=req.body
        if(!email || !username ||!password)
            return res.status(400).json({message:"All fields are required!"})
        if(password.length < 6)
            return res.status(400).json({message:"Password should have atleast 6 characters"})
        if(username.length<3)
            return res.status(400).json({message:"Username should have atleast 3 characters"})
        //check if user already exists

        // const existingUser=await User.findOne({$or:[{email},{username}]})
        // if (existingUser)
        //     return res.status(400).json({message:"User already exists"})

        const existingEmail =await User.findOne({email})
        if (existingEmail)
            return res.status(400).json({message:"Email already exists"})

        const existingUsername =await User.findOne({username})
        if (existingUsername)
            return res.status(400).json({message:"Username already exists"})
        //create new user
        //get random avatar
        const profileImage=`https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`

        const user =new User({
            email,
            username,
            password,
            profileImage
        })

       await user.save()

       const token=generateToken(user._id)
       res.status(201).json({     //a resource is created in backend and sending to app
        token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            profileImage:user.profileImage,
            createdAt:user.createdAt,
            
        }
       })
    } catch (error) {
        console.error("error in registration route:",error);
        
        res.status(500).json({message:"Internal Server Error"})
    }

})

//login route
router.post("/login",async (req,res)=>{
   try {
    const {email,password}=req.body
    if(!email ||!password)
        return res.status(400).json({message:"All fields are required!"})

    //check if user exists
    const user=await User.findOne({email})
    if(!user)
        return res.status(400).json({message:"invalid credentials!"})

    //check if passwords match
    const isPasswordCorrect=await user.comparePassword(password)
    if(!isPasswordCorrect)
        return res.status(400).json({message:"invalid credentials!"})
    //generate token
    const token=generateToken(user._id)
    res.status(200).json({
        token,
        user:{
            id:user._id,
            email:user.email,
            username:user.username,
            profileImage:user.profileImage,
            createdAt:user.createdAt,
        }
    })
   } catch (error) {
    console.log("error in login route :",error)
    res.status(500).json({mesage:"Internal Server Error"})

    
   }

})


export default router