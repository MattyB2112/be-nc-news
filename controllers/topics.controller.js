const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
} = require("../models/topics.model.js");
const endPoints = require("../endpoints.json");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getEndpoints = (req, res) => {
  res.status(200).send(endPoints);
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

exports.getArticleComments = (req, res, next) => {
  id = req.params.article_id;
  fetchArticleComments(id)
    .then((comments) => res.status(200).send(comments))
    .catch(next);
};
