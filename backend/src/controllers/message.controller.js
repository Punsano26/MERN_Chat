import MessageModel from "../models/message.model.js";
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
    res.status(500).json({
      message:
        "Something went wrong Server error while getting users for sidebar",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: resiverId } = req.params;
    if (!resiverId) {
      return res.status(400).json({ message: "Receiver ID not found" });
    }

    const senderId = req.user._id;
    const { text, image } = req.body;
    let imageURL;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = new MessageModel({
      senderId,
      resiverId,
      text,
      image: imageURL,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(resiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error := ", error);
    res.status(500).json({
      message: "Something went wrong Server error while sending Message",
    });
  }
};


export const getMessages = async (req, res) => {

  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await MessageModel.find({
      $or: [
        {
          senderId: myId,
          resiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          resiverId: myId,
        },
      ],
    });
    console.log("messages", messages);
    
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while getting messages" });
  }
};
