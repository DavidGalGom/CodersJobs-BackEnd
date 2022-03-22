import { expect } from "@jest/globals";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";
import IResponseTest from "../../interfaces/response";
import TestError from "../../interfaces/testError";
import IUser from "../../interfaces/user";
import {
  addUser,
  adminDeleteUser,
  getUserById,
  getUsers,
  loginUser,
  updateUser,
} from "./usersControllers";

jest.mock("../../database/models/user");
jest.mock("bcrypt");
const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given a addUser function", () => {
  describe("When it receives a new user", () => {
    test("Then it should summon res.json with a new user", async () => {
      const user: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
      };
      const req: { body: IUser } = {
        body: user,
      };
      const res = mockResponse();
      bcrypt.hash = jest.fn().mockResolvedValue(user.password);
      User.create = jest.fn().mockResolvedValue(user);

      await addUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("When it receives a new user with wrong params", () => {
    test("Then it should summon the next function with an error", async () => {
      const user: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
      };
      const req: { body: IUser } = {
        body: user,
      };
      const next: jest.Mock = jest.fn();
      const expectedError = new Error("Wrong data") as TestError;
      expectedError.code = 400;
      bcrypt.hash = jest.fn().mockResolvedValue(user.password);
      User.create = jest.fn().mockRejectedValue(expectedError);

      await addUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a loginUser function", () => {
  describe("When it receives a wrong username", () => {
    test("Then it should summon next function with an error", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const user: IUser = {
        userName: "David",
        password: "****",
      };
      const req: { body: IUser } = {
        body: user,
      };
      const next: jest.Mock = jest.fn();
      const expectedError = new Error("Wrong credentials") as TestError;
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", 401);
    });
  });
  describe("When it receives an existing username and a correct password", () => {
    test("Then it should summon res.json with a token", async () => {
      const user: IUser = {
        userName: "David",
        password: "****",
        id: "12345",
      };
      const req: { body: IUser } = {
        body: user,
      };
      const expectedToken: { ownerId: string; ownerToken: string } = {
        ownerId: "12345",
        ownerToken: "Token",
      };
      const res: { json: () => string } = {
        json: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("Token");

      await loginUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedToken);
    });
  });
  describe("When it receives a wrong password", () => {
    test("Then it should summon next function with an error", async () => {
      const user: IUser = {
        userName: "David",
        password: "****",
      };
      const req: { body: IUser } = {
        body: user,
      };
      const res: { json: () => string } = {
        json: jest.fn(),
      };
      const next: jest.Mock = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const expectedError = new Error("Wrong credentials") as TestError;
      expectedError.code = 401;

      await loginUser(req, res, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a getUsers function", () => {
  describe("When it receives an object res", () => {
    test("Then it should summon method json", async () => {
      const users: [IUser] = [
        {
          userName: "Admin",
          password: "*******",
          name: "Admin",
          email: "admin@gmail.com",
          isAdmin: true,
          jobsApplied: [],
        },
      ];
      User.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(users) });
      const res: { json: () => string } = {
        json: jest.fn(),
      };

      await getUsers(null, res, null);

      expect(User.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe("When its called wrong", () => {
    test("Then it should return an error and code 400 ", async () => {
      User.find = jest.fn().mockResolvedValue(null);
      const next: jest.Mock = jest.fn();
      const expectedError = new Error("Can't find the users") as TestError;
      expectedError.code = 400;

      await getUsers(null, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Can't find the users"
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a getUsersById function", () => {
  describe("When it receives a correct userId", () => {
    test("Then it should summon res.json with the user", async () => {
      const user: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
      };
      const userId: number = 12345;
      const req: { params } = {
        params: userId,
      };
      const res: { json: jest.Mock } = {
        json: jest.fn(),
      };
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(user) });

      await getUserById(req, res, null);

      expect(User.findById).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("When it receives a wrong id", () => {
    test("Then it should send a 404 error User not found", async () => {
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
      const userId: number = 12345;
      const req: { params } = {
        params: userId,
      };
      const res: { json } = {
        json: jest.fn(),
      };
      const next: jest.Mock = jest.fn();
      const expectedError = new Error("User not found") as TestError;
      expectedError.code = 404;

      await getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("message", "User not found");
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });

  describe("When its called wrong", () => {
    test("Then it should return an error and code 400 ", async () => {
      const userId: number = 12345;
      const req: { params } = {
        params: userId,
      };
      const next: jest.Mock = jest.fn();
      const expectedError = new Error("Bad request") as TestError;
      expectedError.code = 400;
      User.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue({}),
      });

      await getUserById(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message", "Bad request");
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a updateUser function", () => {
  describe("When it receives a correct idUser and body", () => {
    test("Then it should summon res.json with the updated user", async () => {
      const user: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
        id: "12345",
      };
      const idUser: number = 12345;
      const loggedUserId: number = 12345;
      const userFound: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
        id: "12345",
      };
      jwt.verify = jest.fn().mockResolvedValue(loggedUserId);
      User.findOne = jest.fn().mockResolvedValue(userFound);
      const req: { body; params; header } = {
        body: user,
        params: { idUser },
        header: () => "Authorization",
      };
      const res: { json: jest.Mock } = {
        json: jest.fn(),
      };
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(user);

      await updateUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("When it receives a request with no params", () => {
    test("Then it should summon next with a 404 code and user not found", async () => {
      const user: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
        id: "12345",
      };
      const idUser: number = 1234;
      const loggedUserId: number = 12345;
      const userFound: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
        id: "12345",
      };
      jwt.verify = jest.fn().mockResolvedValue(loggedUserId);
      User.findOne = jest.fn().mockResolvedValue(userFound);
      const req: { body; params; header } = {
        body: user,
        params: idUser,
        header: () => "Authorization",
      };
      const res: { json: jest.Mock } = {
        json: jest.fn(),
      };
      const next: jest.Mock = jest.fn();
      const expectedError: {
        message: string;
        code: number;
      } = {
        message: "User not found",
        code: 404,
      };
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty("message", "User not found");
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });

  describe("When it receives a rejected promise", () => {
    test("Then it should summon next with an error", async () => {
      const user: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
        id: "12345",
      };
      const idUser: number = 12345;
      const req: { body; params; header } = {
        body: user,
        params: { idUser },
        header: () => "Authorization",
      };
      const next: jest.Mock = jest.fn();
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await updateUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Bad update request"
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
  describe("When it receives a request with other user", () => {
    test("Then it should summon next with a 401 and a message can't update other people", async () => {
      const user: IUser = {
        userName: "Admin",
        password: "*******",
        name: "Admin",
        email: "admin@gmail.com",
        isAdmin: true,
        jobsApplied: [],
        id: "12345",
      };
      const idUser: number = 12345;
      const loggedUserId: number = 12345;
      const expectedError: { message: string; code: number } = {
        message: "Can't update other people",
        code: 401,
      };
      jwt.verify = jest.fn().mockResolvedValue(loggedUserId);

      User.findOne = jest.fn().mockResolvedValue(null);
      const req: { body; params; header } = {
        body: user,
        params: { idUser },
        header: () => "Authorization",
      };
      const res: { json } = {
        json: jest.fn(),
      };
      const next: jest.Mock = jest.fn();
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(user);

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Can't update other people"
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", 401);
    });
  });
});

describe("Given a adminDeleteUser endpoint", () => {
  describe("When it receives a correct idUser", () => {
    test("Then it should summon res.json with the deleted user", async () => {
      const idUser: number = 123;
      const req: { params: { idUser } } = {
        params: {
          idUser,
        },
      };
      const res = { json: jest.fn() };
      User.findByIdAndDelete = jest.fn().mockResolvedValue(idUser);

      await adminDeleteUser(req, res, null);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(idUser);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an inexistent idUser", () => {
    test("Then it should call next with a 404 code and User not found", async () => {
      const idUser: number = 1;
      const req: { params: { idUser } } = {
        params: {
          idUser,
        },
      };
      const next = jest.fn();
      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      const error: { message: string; code: number } = {
        message: "User not found",
        code: 404,
      };

      await adminDeleteUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("message", "User not found");
      expect(error).toHaveProperty("code", 404);
    });
  });

  describe("When it receives a wrong request", () => {
    test("Then it should call next with a 400 code and Bad request message", async () => {
      const idUser: number = 1;
      const req: { params: { idUser } } = {
        params: {
          idUser,
        },
      };
      const next = jest.fn();
      const error: { message: string; code: number } = {
        message: "Bad request",
        code: 400,
      };
      User.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await adminDeleteUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("message", "Bad request");
      expect(error).toHaveProperty("code", 400);
    });
  });
});
