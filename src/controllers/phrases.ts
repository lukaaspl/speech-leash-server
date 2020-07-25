/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller } from "domains/controller";
import { codes, messages } from "domains/responses";
import { validationResult } from "express-validator";
import HttpError from "models/http-error";
import Phrase, { IPhrase } from "models/phrase";
import User from "models/user";
import { startSession } from "mongoose";
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
  let user;

  try {
    // probably need to pass options object with path and model when populating an array
    // just path seems not to work in this case
    user = await User.findById(userId).populate({
      path: "phrases",
      model: "Phrase",
    });
  } catch {
    return next(getInternalError());
  }

  if (!user) {
    return next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
  }

  const transformedUserPhrases = user.phrases.map((phrase) =>
    // casting because of populate
    ((phrase as unknown) as IPhrase).toObject({ getters: true })
  );

  res.json(transformedUserPhrases);
};

export const addPhrase: Controller = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const { userId, phrase, translations } = req.body;
  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (e) {
    console.log(e);
    return next(getInternalError());
  }

  if (!foundUser) {
    return next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
  }

  const newPhrase = new Phrase({
    userId,
    phrase,
    translations,
    creationDate: Date.now(),
  });

  try {
    const session = await startSession();
    session.startTransaction();

    await newPhrase.save({ session });

    // casting because of populate
    ((foundUser.phrases as unknown) as IPhrase[]).push(newPhrase);

    await foundUser.save({ session });
    await session.commitTransaction();
  } catch (e) {
    return next(getInternalError());
  }

  res.status(codes.CREATED).json(newPhrase.toObject({ getters: true }));
};

export const updatePhraseById: Controller = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError(messages.INVALID_DATA, codes.BAD_REQUEST));
  }

  const { phraseId } = req.params;
  const { phrase, translations } = req.body;
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
  updatedPhrase.translations = translations;

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
    phrase = await Phrase.findById(phraseId).populate("userId");
  } catch {
    return next(getInternalError());
  }

  if (!phrase) {
    return next(new HttpError(messages.RESOURCE_NOT_FOUND, codes.NOT_FOUND));
  }

  try {
    const session = await startSession();
    session.startTransaction();

    //@ts-ignore
    await phrase.remove({ session });

    //@ts-ignore
    phrase.userId.phrases.pull(phrase);

    //@ts-ignore
    await phrase.userId.save({ session });

    await session.commitTransaction();
  } catch (e) {
    console.log(e);
    return next(getInternalError());
  }

  res.sendStatus(codes.OK);
};
