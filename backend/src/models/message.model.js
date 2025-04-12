import mongoose from "mongoose";
import { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    resiverId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    text: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("message", MessageSchema);
export default MessageModel;
