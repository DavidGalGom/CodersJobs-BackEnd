import dotenv from "dotenv";
import Job from "../../database/models/job";

dotenv.config();

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    error.message = "Can't find the jobs";
    error.code = 400;
    next(error);
  }
};

export default getJobs;
