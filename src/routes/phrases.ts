import * as phrasesControllers from "controllers/phrases";
import express from "express";
import { check } from "express-validator";

const router = express.Router();

const phraseValidators = [
  check("phrase").notEmpty().isString(),
  check("translations").notEmpty().isArray(),
];

router.get("/", phrasesControllers.getPhrases);

router.get("/:phraseId", phrasesControllers.getPhraseById);

router.get("/user/:userId", phrasesControllers.getPhrasesByUserId);

router.post("/", phraseValidators, phrasesControllers.addPhrase);

router.patch(
  "/:phraseId",
  phraseValidators,
  phrasesControllers.updatePhraseById
);

router.delete("/:phraseId", phrasesControllers.deletePhraseById);

export default router;
