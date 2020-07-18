import express from "express";
import * as phrasesControllers from "../controllers/phrases";

const router = express.Router();

router.get("/", phrasesControllers.getPhrases);

router.get("/:phraseId", phrasesControllers.getPhraseById);

router.get("/user/:userId", phrasesControllers.getPhrasesByUserId);

router.post("/", phrasesControllers.addPhrase);

router.patch("/:phraseId", phrasesControllers.updatePhraseById);

router.delete("/:phraseId", phrasesControllers.deletePhraseById);

export default router;
