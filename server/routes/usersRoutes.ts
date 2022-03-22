import express from "express";
import {
  loginUser,
  addUser,
  getUsers,
  getUserById,
  updateUser,
} from "../controllers/usersControllers";
import adminAuth from "../middlewares/adminAuth";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/", auth, adminAuth, getUsers);

router.get("/:userId", auth, getUserById);
router.put("/:idUser", auth, updateUser);

export default router;
