import { validationResult } from "express-validator";
import { v4 as uuid } from "uuid";
import { codes, messages } from "../domains/responses";
import { Controller } from "../domains/controller";
import HttpError from "../models/http-error";

const PHRASES = [
  {
    id: "1",
    userId: "1",
    phrase: "dog",
    creationDate: Date.now(),
  },
  {
    id: "2",
    userId: "1",
    phrase: "cat",
    creationDate: Date.now(),
  },
  {
    id: "3",
    userId: "3",
    phrase: "cow",
    creationDate: Date.now(),
  },
  {
    id: "4",
    userId: "2",
    phrase: "horse",
    creationDate: Date.now(),
  },
];

export const getPhrases: Controller = (req, res) => {
  res.json(PHRASES);
};

export const getPhraseById: Controller = (req, res, next) => {
  const { phraseId } = req.params;
  const phrase = PHRASES.find(({ id }) => id === phraseId);

  if (phrase) {
    return res.json(phrase);
  }

  next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
};

export const getPhrasesByUserId: Controller = (req, res, next) => {
  const { userId } = req.params;
  const phrases = PHRASES.filter(({ userId: id }) => id === userId);

  if (phrases.length) {
    return res.json(phrases);
  }

  next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
};

export const addPhrase: Controller = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const newPhrase = {
    id: uuid(),
    userId: uuid(),
    phrase: req.body.phrase,
    creationDate: Date.now(),
  };

  PHRASES.push(newPhrase);

  res.status(codes.CREATED).json(newPhrase);
};

export const updatePhraseById: Controller = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const { phraseId } = req.params;
  const { phrase } = req.body;

  const phraseIndexToUpdate = PHRASES.findIndex(({ id }) => id === phraseId);

  if (phraseIndexToUpdate === -1) {
    return next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
  }

  PHRASES[phraseIndexToUpdate].phrase = phrase;

  const updatedPhrase = {
    ...PHRASES[phraseIndexToUpdate],
    phrase,
  };

  res.json(updatedPhrase);
};

export const deletePhraseById: Controller = (req, res, next) => {
  const { phraseId } = req.params;

  const phraseIndexToDelete = PHRASES.findIndex(({ id }) => id === phraseId);

  if (phraseIndexToDelete === -1) {
    return next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
  }

  PHRASES.splice(phraseIndexToDelete, 1);

  res.sendStatus(codes.OK);
};
