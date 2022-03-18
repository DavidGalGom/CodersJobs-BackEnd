import express from "express";
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
  getJobById,
} from "../controllers/jobsControllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", getJobs);
router.post("/", auth, createJob);
router.delete("/:idJob", auth, deleteJob);
router.put("/:idJob", auth, updateJob);
router.get("/:idJob", getJobById);
export default router;
