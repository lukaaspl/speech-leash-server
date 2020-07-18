import { matchedData } from "express-validator";

export const codes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const messages = {
  INVALID_DATA: "Invalid data format",
  INVALID_CREDENTIALS: "Invalid credentials",
  RESOURCE_NOT_FOUND: "Resource was not found",
  EMAIL_ALREADY_EXISTS: "E-mail already exists",
};
