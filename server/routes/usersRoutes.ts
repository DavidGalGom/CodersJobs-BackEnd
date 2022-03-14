import express from "express";
import { loginUser, addUser } from "../controllers/usersControllers";

const router = express.Router();

router.post("/register", addUser);
router.post("/login", loginUser);

export default router;
