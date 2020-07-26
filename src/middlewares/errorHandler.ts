import { codes } from "domains/responses";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  // eslint-disable-next-line
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
};

export default errorHandler;
