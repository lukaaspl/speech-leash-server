import express from "express";
import { check } from "express-validator";
import * as usersControllers from "../controllers/users";

const router = express.Router();

const credentialsValidators = [
  check("email").notEmpty().isEmail(),
  check("password").notEmpty().isString().isLength({ min: 6, max: 50 }),
];

router.get("/", usersControllers.getUsers);

router.post("/login", credentialsValidators, usersControllers.login);

router.post(
  "/:register",
  [
    ...credentialsValidators,
    check("name").notEmpty().isString().isLength({ min: 2, max: 50 }),
  ],
  usersControllers.register
);

export default router;
