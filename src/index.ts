import express from "express";
import bodyParser from "body-parser";

const app: express.Application = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hi!");
});

app.listen(5000, () => {
  console.log("Server is up and running");
});
