import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized - no Token Provider"})
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({message:"Unathorized - Invalid Token"})
        }
        const user = await UserModel.findById(decode.userId).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({message:"Internal Server Error while checking token"})
    }
}