import express from "express";
import loginUser from "../controllers/usersControllers";

const router = express.Router();

router.post("/login", loginUser);

export default router;
