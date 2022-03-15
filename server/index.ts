import express from "express";
import chalk from "chalk";
import cors from "cors";
import morgan from "morgan";
import Debug from "debug";
import IError from "../interfaces/error";
import { generalErrorHandler, notFoundErrorHandler } from "./middlewares/error";
import usersRoutes from "./routes/usersRoutes";
import jobsRoutes from "./routes/jobsRoutes";

const debug = Debug("jobs:server");

export const app = express();

export const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellow(`Listening at port number: ${port}`));
      resolve(server);
    });

    server.on("error", (error: IError) => {
      debug(chalk.red("Error at initialize server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`Port number ${port} is already in use`));
      }
      reject();
    });

    server.on("close", () => {
      debug(chalk.yellow("Express server disconnected"));
    });
  });

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/users", usersRoutes);
app.use("/jobs", jobsRoutes);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);
