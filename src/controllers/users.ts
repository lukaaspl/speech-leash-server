import { Controller } from "domains/controller";
import { codes, messages } from "domains/responses";
import { validationResult } from "express-validator";
import HttpError from "models/http-error";
import User from "models/user";
import { getInternalError } from "utils/errors";

export const getUsers: Controller = async (_, res, next) => {
  try {
    const users = await User.find({}, "-password");
    const transformedUsers = users.map((user) =>
      user.toObject({ getters: true })
    );

    res.json(transformedUsers);
  } catch {
    next(getInternalError());
  }
};

export const login: Controller = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email });
  } catch {
    return next(getInternalError());
  }

  if (!user || user.password !== password) {
    return next(
      new HttpError(messages.INVALID_CREDENTIALS, codes.UNAUTHORIZED)
    );
  }

  res.json(`Logged in as ${user.name}`);
};

export const register: Controller = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const { name, email, password } = req.body;
  let emailAlreadyExists: boolean;

  try {
    emailAlreadyExists = Boolean(await User.findOne({ email }));
  } catch {
    return next(getInternalError());
  }

  if (emailAlreadyExists) {
    return next(new HttpError(messages.EMAIL_ALREADY_EXISTS, codes.CONFLICT));
  }

  const newUser = new User({
    name,
    email,
    password,
    phrases: [],
  });

  try {
    await newUser.save();
  } catch {
    return next(getInternalError());
  }

  res.json(newUser.toObject({ getters: true }));
};
