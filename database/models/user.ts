import { Schema, model, Types } from "mongoose";

const jobAppliedSchema = new Schema({
  jobId: {
    type: Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

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
    type: [jobAppliedSchema],
    required: true,
  },
});

const User = model("User", userSchema, "Users");

export default User;
