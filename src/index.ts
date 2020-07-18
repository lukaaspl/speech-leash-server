import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { codes } from "./domains/responses";
import HttpError from "./models/http-error";
import phrasesRouter from "./routes/phrases";
import usersRouter from "./routes/users";

const app: express.Application = express();

app.use(bodyParser.json());

app.use("/phrases", phrasesRouter);

app.use("/users", usersRouter);

app.use(() => {
  throw new HttpError("Route not found", codes.NOT_FOUND);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  const errorCode = error.code || codes.INTERNAL_SERVER_ERROR;

  if (error.message) {
    res.status(errorCode).json({
      message: error.message,
    });
    return;
  }

  res.sendStatus(errorCode);
});

app.listen(5000, () => {
  console.log("Server is up and running");
});
