import jwt from "jsonwebtoken"
import User from "../models/User.js"


//in react headers:{Authorization:`Bearer ${token}`}
const protectRoute=async(req,res,next) =>{
    try {
        //get token
        const token=req.header("Authorization").replace("Bearer ","")
        if (!token)
            return res.status(401).json({message:"No Authentication Token , Access Denied"}) //401 -unautherized

        //verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        //FIND USER
        const user=await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(400).json({message:"Token is not valid"})

        req.user=user
        next()


    } catch (error) {
        console.log("Authentication error:",error.message);
        res.status(500).json({message:"Token is not valid"})
        
    }
}

export default protectRoute;