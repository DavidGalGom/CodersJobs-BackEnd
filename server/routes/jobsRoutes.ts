import express from "express";
import { validate } from "express-validation";
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
  getJobById,
} from "../controllers/jobsControllers";
import auth from "../middlewares/auth";
import jobSchema from "../schemas/jobSchema";

const router = express.Router();

router.get("/", getJobs);
router.post("/", auth, validate(jobSchema), createJob);
router.delete("/:idJob", auth, deleteJob);
router.put("/:idJob", auth, updateJob);
router.get("/:idJob", getJobById);
export default router;
