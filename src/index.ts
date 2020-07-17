import express from "express";

const app: express.Application = express();

app.get("/", (req, res) => {
  res.send("Hi!");
});

app.listen(5000, () => {
  console.log("Server is up and running");
});
