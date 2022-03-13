import dotenv from "dotenv";
import initializeMongoDBServer from "./database";
import { initializeServer } from "./server";

dotenv.config();

const port: number | string =
  process.env.PORT ?? process.env.LOCAL_PORT ?? 5000;

(async () => {
  try {
    await initializeServer(port);
    await initializeMongoDBServer(process.env.MONGODB_STRING);
  } catch (error) {
    process.exit(1);
  }
})();
