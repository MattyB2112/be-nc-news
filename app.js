const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticleById,
} = require("./controllers/topics.controller.js");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ message: "endpoint not found!" });
});

module.exports = app;
