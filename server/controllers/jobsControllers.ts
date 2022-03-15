import dotenv from "dotenv";
import Job from "../../database/models/job";

dotenv.config();

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    error.message = "Can't find the jobs";
    error.code = 400;
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const job = req.body;
    const newJob = await Job.create(job);
    res.status(201).json(newJob);
  } catch (error) {
    error.code = 400;
    error.message = "Bad request";
    next(error);
  }
};
