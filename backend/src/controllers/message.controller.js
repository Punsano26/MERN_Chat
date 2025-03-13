// import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../libs/cloundinary.js";
import { getReceiverSocketId, io } from "../libs/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await UserModel.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
        res.status(500).json({ message: "Something went wrong Server error while getting users for sidebar" })
    }
}