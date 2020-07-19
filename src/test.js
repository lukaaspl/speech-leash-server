/* eslint-disable */
const mongoose = require("mongoose");
const express = require("express");

const app = express();

const client = mongoose.connect("mongodb://localhost:27017/speech-leash");

const Phrase = mongoose.model(
  "Phrase",
  new mongoose.Schema({
    userId: { type: String, required: true },
    phrase: { type: String, required: true },
    creationDate: { type: Number, required: true },
  })
);

app.get("/", async (req, res) => {
  const phrase = await Phrase.find();
  res.json(phrase);
});

app.listen(5001, console.log.bind(this, "Server is up"));
