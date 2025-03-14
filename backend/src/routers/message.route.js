import express from "express";
const router = express.Router();
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { checkFriendShip } from "../middleware/friend.middleware.js";

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessages);
router.post("/send:id", protectedRoute, checkFriendShip, sendMessage);

export default router;
