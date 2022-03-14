import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  jobsApplied: {
    type: [Types.ObjectId],
    ref: "Job",
    required: true,
  },
});

const User = model("User", userSchema, "Users");

export default User;
