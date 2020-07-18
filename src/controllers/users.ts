import { validationResult } from "express-validator";
import { v4 as uuid } from "uuid";
import codes from "../domains/codes";
import { Controller } from "../domains/controller";
import HttpError from "../models/http-error";

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
    return next(new HttpError("Invalid data format", codes.BAD_REQUEST));
  }

  const { email, password } = req.body;

  const foundUser = USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    return next(new HttpError("Invalid credentials", codes.UNAUTHORIZED));
  }

  res.json(`Logged in as ${foundUser.name}`);
};

export const register: Controller = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError("Invalid data format", codes.BAD_REQUEST));
  }

  const { name, email, password } = req.body;

  const emailAlreadyExists = Boolean(
    USERS.find((user) => user.email === email)
  );

  if (emailAlreadyExists) {
    return next(new HttpError("E-mail already exists", codes.CONFLICT));
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
