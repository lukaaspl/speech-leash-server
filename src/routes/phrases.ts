import express from "express";
import { check } from "express-validator";
import * as phrasesControllers from "../controllers/phrases";

const router = express.Router();

const phraseValidator = check("phrase")
  .notEmpty()
  .isString()
  .isLength({ min: 2, max: 100 });

router.get("/", phrasesControllers.getPhrases);

router.get("/:phraseId", phrasesControllers.getPhraseById);

router.get("/user/:userId", phrasesControllers.getPhrasesByUserId);

router.post("/", phraseValidator, phrasesControllers.addPhrase);

router.patch(
  "/:phraseId",
  phraseValidator,
  phrasesControllers.updatePhraseById
);

router.delete("/:phraseId", phrasesControllers.deletePhraseById);

export default router;
