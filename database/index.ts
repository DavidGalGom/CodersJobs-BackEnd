import debug from "debug";
import chalk from "chalk";
import mongoose from "mongoose";

const initializeMongoDBServer = (connectionString) =>
  new Promise<void>((resolve, reject) => {
    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.red("Can't connect to the database"));
        debug(chalk.red(error.message));
        reject(error);
        return;
      }
      debug(chalk.green("Connected to the database"));
      resolve();
    });
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret.__v;
      },
    });
    mongoose.connection.on("close", () => {
      debug(chalk.green("Connection to database OVER"));
    });
  });

export default initializeMongoDBServer;
