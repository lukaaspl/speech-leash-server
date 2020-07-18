import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import HttpError from "./models/http-error";
import phrasesRouter from "./routes/phrases";

const app: express.Application = express();

app.use(bodyParser.json());

app.use(
  "/phrases",
  check("phrase").notEmpty().isString().isLength({ min: 2, max: 100 }),
  phrasesRouter
);

app.use(() => {
  throw new HttpError("Route not found", 404);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  const errorCode = error.code || 500;

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
