import Debug from "debug";
import IError from "../../interfaces/error";

const debug = Debug("jobs:errors");

export const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generalErrorHandler = (error: IError, req, res, next) => {
  if (error.statusCode === 400) {
    error.code = 400;
    error.message = "Validation error";
  }
  debug("There is a problem: ", error.message);
  const message = error.code ? error.message : "Fatal error";
  res.status(error.code || 500).json({ error: message });
};
