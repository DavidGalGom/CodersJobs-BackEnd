import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../../database/models/user";

dotenv.config();

const addUser = async (req, res, next) => {
  const user = req.body;
  try {
    const password = await bcrypt.hash(user.password, 10);
    const users = await User.create({
      userName: user.userName,
      password,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    res.status(201).json(users);
  } catch {
    const error: { code: number; message: string } = {
      code: 400,
      message: "Wrong data",
    };
    next(error);
  }
};

export default addUser;
