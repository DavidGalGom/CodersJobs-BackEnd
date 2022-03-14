import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";

dotenv.config();

export const addUser = async (req, res, next) => {
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

export const loginUser = async (req, res, next) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  if (!user) {
    const error: { code: number; message: string } = {
      code: 401,
      message: "Wrong credentials",
    };
    next(error);
  } else {
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      const error: { code: number; message: string } = {
        code: 401,
        message: "Wrong credentials",
      };
      next(error);
    } else {
      const token = jwt.sign(
        {
          name: user.name,
          userName: user.userName,
          email: user.email,
          isAdmin: user.isAdmin,
          id: user.id,
          posts: user.posts,
        },
        process.env.TOKEN,
        {
          expiresIn: 24 * 60 * 60,
        }
      );
      const loginToken: { ownerId: string; ownerToken: string } = {
        ownerId: user.id,
        ownerToken: token,
      };
      res.json(loginToken);
    }
  }
};
