import { expect } from "@jest/globals";
import IError from "../../interfaces/error";
import IResponseTest from "../../interfaces/response";
import { generalErrorHandler, notFoundErrorHandler } from "./error";

const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given a notFoundError handler function", () => {
  describe("When it receives a request", () => {
    test("Then it should return a error code 404 and a error message 'Endpoint not found' ", () => {
      const res = mockResponse();

      notFoundErrorHandler(null, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Endpoint not found" });
    });
  });
});

describe("Given a general error handler", () => {
  describe("When it receives an error without information", () => {
    test("Then it should return a code 500 and a fatal error message", () => {
      const res = mockResponse();
      const error = new Error("Fatal error") as IError;
      error.statusCode = 500;

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("When it receives a ValidationError", () => {
    test("Then it should return an error with code 400 and a Validation error message", () => {
      const res = mockResponse();
      const error = new Error("Validation error") as IError;
      error.statusCode = 400;

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
