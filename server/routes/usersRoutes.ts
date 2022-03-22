import express from "express";
import { validate } from "express-validation";
import {
  loginUser,
  addUser,
  getUsers,
  getUserById,
  updateUser,
  adminDeleteUser,
} from "../controllers/usersControllers";
import adminAuth from "../middlewares/adminAuth";
import auth from "../middlewares/auth";
import userSchema from "../schemas/userSchema";

const router = express.Router();

router.post("/register", validate(userSchema), addUser);
router.post("/login", loginUser);
router.get("/", auth, adminAuth, getUsers);
router.get("/:userId", auth, getUserById);
router.put("/:idUser", auth, updateUser);
router.delete("/:idUser", auth, adminAuth, adminDeleteUser);

export default router;
