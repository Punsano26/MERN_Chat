import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
const node_mode = process.env.NODE_ENV;

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, secret, { expiresIn: "24h" });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: node_mode !== "development",
  }); //xss Attack CSRF Attack
  console.log("token generated ans cookie set");

  return token;
};
