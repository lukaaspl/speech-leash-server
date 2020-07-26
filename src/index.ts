import bodyParser from "body-parser";
import { config } from "dotenv";
import express from "express";
import errorHandler from "middlewares/errorHandler";
import notFound from "middlewares/notFound";
import mongoose from "mongoose";
import phrasesRouter from "routes/phrases";
import usersRouter from "routes/users";

config();

const app: express.Application = express();

app.use(bodyParser.json());
app.use("/phrases", phrasesRouter);
app.use("/users", usersRouter);
app.use(notFound);
app.use(errorHandler);

(async () => {
  const { DB_CONNECTION_URI, PORT } = process.env;

  try {
    await mongoose.connect(<string>DB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });
  } catch {
    console.log("An error occurred while establishing the connection");
  }
})();
