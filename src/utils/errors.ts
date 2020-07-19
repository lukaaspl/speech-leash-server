import HttpError from "models/http-error";
import { messages, codes } from "domains/responses";

export const getInternalError = (): HttpError =>
  new HttpError(messages.UNEXPECTED_ERROR, codes.INTERNAL_SERVER_ERROR);
