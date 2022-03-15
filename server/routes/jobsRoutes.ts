import express from "express";
import { getJobs, createJob } from "../controllers/jobsControllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", getJobs);
router.post("/", auth, createJob);
export default router;
