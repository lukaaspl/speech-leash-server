import HttpError from "../models/http-error";
import { Controller } from "../domains/controller";

const PHRASES = [
  {
    id: 1,
    userId: 1,
    phrase: "dog",
    creationDate: Date.now(),
  },
  {
    id: 2,
    userId: 1,
    phrase: "cat",
    creationDate: Date.now(),
  },
  {
    id: 3,
    userId: 3,
    phrase: "cow",
    creationDate: Date.now(),
  },
  {
    id: 4,
    userId: 2,
    phrase: "horse",
    creationDate: Date.now(),
  },
];

export const getPhrases: Controller = (req, res) => {
  res.json(PHRASES);
};

export const getPhraseById: Controller = (req, res, next) => {
  const { phraseId } = req.params;
  const phrase = PHRASES.find(({ id }) => id === Number(phraseId));

  if (phrase) {
    return res.json(phrase);
  }

  next(new HttpError(`Phrase with id ${phraseId} was not found`, 404));
};

export const getPhrasesByUserId: Controller = (req, res, next) => {
  const { userId } = req.params;
  const phrases = PHRASES.filter(({ userId: id }) => id === Number(userId));

  if (phrases.length) {
    return res.json(phrases);
  }

  next(new HttpError(`No phrase was found for user with id ${userId}`));
};

export const addPhrase: Controller = (req, res, next) => {
  if (!req.body.phrase) {
    return next(new HttpError("Phrase is required", 400));
  }

  const newPhrase = {
    id: PHRASES.length ? PHRASES[PHRASES.length - 1].id + 1 : 1,
    userId: Math.trunc(Math.random() * 10) + 1,
    phrase: req.body.phrase,
    creationDate: Date.now(),
  };

  PHRASES.push(newPhrase);

  res.status(201).json(newPhrase);
};

export const updatePhraseById: Controller = (req, res, next) => {
  const { phraseId } = req.params;
  const { phrase } = req.body;

  const phraseIndexToUpdate = PHRASES.findIndex(
    ({ id }) => id === Number(phraseId)
  );

  if (phraseIndexToUpdate === -1) {
    return next(new HttpError(`Phrase with id ${phraseId} was not found`, 404));
  }

  if (!phrase || typeof phrase !== "string") {
    return next(
      new HttpError(`No phrase was passed in body or passed invalid one`, 400)
    );
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

  const phraseIndexToDelete = PHRASES.findIndex(
    ({ id }) => id === Number(phraseId)
  );

  if (phraseIndexToDelete === -1) {
    return next(new HttpError(`Phrase with id ${phraseId} was not found`, 404));
  }

  PHRASES.splice(phraseIndexToDelete, 1);

  res.sendStatus(200);
};
