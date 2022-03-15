import { expect } from "@jest/globals";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";
import IResponseTest from "../../interfaces/response";
import TestError from "../../interfaces/testError";
import IUser from "../../interfaces/user";
import { addUser, loginUser } from "./usersControllers";

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
