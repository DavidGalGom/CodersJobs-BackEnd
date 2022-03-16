import { Schema, model, Types } from "mongoose";

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  companyAnchor: {
    type: String,
    required: true,
  },
  jobAnchor: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  numberOfWorkers: {
    type: Number,
  },
  startup: {
    type: Boolean,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  desiredProfile: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  releaseDate: {
    type: Date,
    default: new Date(),
  },
  owner: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Job = model("Job", jobSchema, "Jobs");

export default Job;
