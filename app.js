const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getArticleComments,
  postArticleComment,
  changeProperty,
  deleteComment,
  getUsers,
} = require("./controllers/topics.controller.js");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", changeProperty);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else if ((err.code = "42703")) {
    res.status(400).send({ message: "bad request" });
  } else console.log(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ message: "endpoint not found!" });
});

module.exports = app;
