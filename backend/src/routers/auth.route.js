import express from "express";
const router = express.Router();
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controllers.js";

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update-profile:id", updateProfile);

export default router;
