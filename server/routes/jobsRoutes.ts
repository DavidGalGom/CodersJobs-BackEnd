import express from "express";
import {
  getJobs,
  createJob,
  deleteJob,
  updateJob,
} from "../controllers/jobsControllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", getJobs);
router.post("/", auth, createJob);
router.delete("/:idJob/:idOwner", auth, deleteJob);
router.put("/:idJob", auth, updateJob);
export default router;
