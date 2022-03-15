import { expect } from "@jest/globals";
import adminAuth from "./adminAuth";

describe("Given a adminAuth middleware", () => {
  describe("When it receives a request with isAdmin=false", () => {
    test("Then it should send an error with code 403 and not allowed message", async () => {
      const req: { params: { isAdmin: boolean } } = {
        params: {
          isAdmin: false,
        },
      };
      const next: jest.Mock = jest.fn();
      const error: { code: number; message: string } = {
        code: 403,
        message: "You are not allowed",
      };

      await adminAuth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a request with isAdmin = true", () => {
    test("Then it should summon next with no params", async () => {
      const req: { isAdmin: jest.Mock } = {
        isAdmin: jest.fn().mockReturnValue(true),
      };

      const next: jest.Mock = jest.fn();

      await adminAuth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
