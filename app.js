const cors = require("cors");
const express = require("express");
const {
  postArticleComment,
  changeProperty,
  deleteComment,
} = require("./controllers/topics.controller.js");
const app = express();
const apiRouter = require("./api-router.js");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", changeProperty);

app.delete("/api/comments/:comment_id", deleteComment);

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
