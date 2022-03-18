import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Job from "../../database/models/job";
import IJob from "../../interfaces/job";

dotenv.config();

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate({
      path: "owner",
      select: "userName",
    });
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

export const deleteJob = async (req, res, next) => {
  const jobOwner: string = req.body;
  const { idJob } = req.params;
  const authExist = req.header("Authorization");
  try {
    const token = authExist.split(" ")[1];
    const user = jwt.verify(token, process.env.TOKEN);
    if (idJob) {
      if (user.id === jobOwner) {
        const deletedJob = await Job.findByIdAndDelete(idJob);
        res.json(deletedJob);
      } else {
        const error: { message: string; code: number } = {
          message: "Can't delete other people jobs",
          code: 401,
        };
        next(error);
      }
    } else {
      const error: { message: string; code: number } = {
        message: "Job not found",
        code: 404,
      };
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Bad delete request";
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  const job: IJob = req.body;
  const { idJob } = req.params;
  const authExist = req.header("Authorization");
  try {
    const token = authExist.split(" ")[1];
    const user = jwt.verify(token, process.env.TOKEN);
    if (idJob) {
      if (user.id === job.owner) {
        const updatedJob = await Job.findByIdAndUpdate(idJob, job, {
          new: true,
        });
        res.json(updatedJob);
      } else {
        const error: { message: string; code: number } = {
          message: "Can't update other people jobs",
          code: 401,
        };
        next(error);
      }
    } else {
      const error: { message: string; code: number } = {
        message: "Job not found",
        code: 404,
      };
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Bad update request";
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  const { idJob } = req.params;
  try {
    const searchedJob = await Job.findById(idJob);
    if (searchedJob) {
      res.json(searchedJob);
    } else {
      const error: any = new Error("Job not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Bad request";
    next(error);
  }
};
