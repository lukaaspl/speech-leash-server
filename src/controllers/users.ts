import { Controller } from "domains/controller";
import { codes, messages } from "domains/responses";
import { validationResult } from "express-validator";
import HttpError from "models/http-error";
import { v4 as uuid } from "uuid";

const USERS = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    password: "adminadmin",
  },
  { id: "2", name: "User", email: "user@example.com", password: "useruser" },
];

export const getUsers: Controller = (_, res) => {
  res.json(USERS);
};

export const login: Controller = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const { email, password } = req.body;

  const foundUser = USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    return next(
      new HttpError(messages.INVALID_CREDENTIALS, codes.UNAUTHORIZED)
    );
  }

  res.json(`Logged in as ${foundUser.name}`);
};

export const register: Controller = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const { name, email, password } = req.body;

  const emailAlreadyExists = Boolean(
    USERS.find((user) => user.email === email)
  );

  if (emailAlreadyExists) {
    return next(new HttpError(messages.EMAIL_ALREADY_EXISTS, codes.CONFLICT));
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  USERS.push(newUser);

  res.json(newUser);
};
