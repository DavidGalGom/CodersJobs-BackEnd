import express from "express";
import {
  loginUser,
  addUser,
  getUsers,
  getUserById,
} from "../controllers/usersControllers";
import adminAuth from "../middlewares/adminAuth";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/", auth, adminAuth, getUsers);
router.get("/:userId", auth, getUserById);

export default router;
