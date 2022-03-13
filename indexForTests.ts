import dotenv from "dotenv";
import { initializeServer } from "./server/index";
import initializeMongoDBServer from "./database/index";

dotenv.config();

(async () => {
  try {
    await initializeMongoDBServer(process.env.MONGODB_STRING_TEST);
    await initializeServer(1000);
  } catch (error) {
    process.exit(1);
  }
})();
