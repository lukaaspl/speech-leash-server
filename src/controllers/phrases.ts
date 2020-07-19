import { Controller } from "domains/controller";
import { codes, messages } from "domains/responses";
import { validationResult } from "express-validator";
import HttpError from "models/http-error";
import Phrase from "models/phrase";
import { getInternalError } from "utils/errors";

export const getPhrases: Controller = async (req, res, next) => {
  try {
    const phrases = await Phrase.find();
    const transformedPhrases = phrases.map((phrase) =>
      phrase.toObject({ getters: true })
    );
    return res.json(transformedPhrases);
  } catch {
    next(getInternalError());
  }
};

export const getPhraseById: Controller = async (req, res, next) => {
  const { phraseId } = req.params;
  let phrase;

  try {
    phrase = await Phrase.findById(phraseId);
  } catch {
    return next(getInternalError());
  }

  if (!phrase) {
    return next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
  }

  res.json(phrase.toObject({ getters: true }));
};

export const getPhrasesByUserId: Controller = async (req, res, next) => {
  const { userId } = req.params;
  let phrases;

  try {
    phrases = await Phrase.find({ userId: userId });
  } catch {
    return next(getInternalError());
  }

  const transformedPhrases = phrases.map((phrase) =>
    phrase.toObject({ getters: true })
  );

  res.json(transformedPhrases);
};

export const addPhrase: Controller = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const newPhrase = new Phrase({
    userId: "dummy-user-id",
    phrase: req.body.phrase,
    creationDate: Date.now(),
  });

  try {
    await newPhrase.save();
  } catch {
    return next(getInternalError());
  }

  res.json(newPhrase.toObject({ getters: true }));
};

export const updatePhraseById: Controller = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const { phraseId } = req.params;
  const { phrase } = req.body;
  let updatedPhrase;

  try {
    // it returns not updated object
    // updatedPhrase = await Phrase.findByIdAndUpdate(phraseId, { phrase });
    updatedPhrase = await Phrase.findById(phraseId);
  } catch {
    return next(getInternalError());
  }

  if (!updatedPhrase) {
    return next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
  }

  updatedPhrase.phrase = phrase;

  try {
    await updatedPhrase.save();
  } catch {
    return next(getInternalError());
  }

  res.json(updatedPhrase.toObject({ getters: true }));
};

export const deletePhraseById: Controller = async (req, res, next) => {
  const { phraseId } = req.params;
  let phrase;

  try {
    phrase = await Phrase.findById(phraseId);
  } catch {
    return next(getInternalError());
  }

  if (!phrase) {
    return next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
  }

  try {
    await phrase.remove();
    res.sendStatus(codes.OK);
  } catch {
    return next(getInternalError());
  }
};
