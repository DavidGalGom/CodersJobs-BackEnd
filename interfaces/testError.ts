import { ValidationError } from "express-validation";

export default interface TestError extends ValidationError {
  message: string;
  code: number;
}
