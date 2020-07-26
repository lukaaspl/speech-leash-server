import HttpError from "models/http-error";
import { codes } from "domains/responses";

const notFound = (): never => {
  throw new HttpError("Route not found", codes.NOT_FOUND);
};

export default notFound;
