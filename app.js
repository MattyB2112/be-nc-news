const express = require("express");
const { getTopics } = require("./controllers/topics.controller.js");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ message: "endpoint not found!" });
});

module.exports = app;
