import { Request } from "express";

interface RequestAuth extends Request {
  userId?: string;
  username?: string;
}

export default RequestAuth;
