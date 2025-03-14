import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  addFriend,
  acceptFriendRequest,
} from "../controllers/friend.controller.js";

const router = express.Router();
router.post("/add", protectedRoute, addFriend);
router.post("/accept", protectedRoute, acceptFriendRequest);

export default router;
