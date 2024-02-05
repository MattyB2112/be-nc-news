const apiRouter = require("express").Router();
const {
  getUsers,
  getEndpoints,
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
} = require("./controllers/topics.controller.js");

apiRouter.get("/users", getUsers);

apiRouter.get("/", getEndpoints);

apiRouter.get("/topics", getTopics);

apiRouter.get("/articles", getArticles);

apiRouter.get("/articles/:article_id", getArticleById);

apiRouter.get("/articles/:article_id/comments", getArticleComments);

module.exports = apiRouter;
