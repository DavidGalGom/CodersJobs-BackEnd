import express from "express";
import getJobs from "../controllers/jobsControllers";

const router = express.Router();

router.get("/", getJobs);

export default router;
