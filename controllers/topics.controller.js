const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  addArticleComment,
  updateProperty,
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

exports.postArticleComment = (req, res, next) => {
  const comment = req.body;

  const { article_id } = req.params;
  addArticleComment(comment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.changeProperty = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateProperty(inc_votes, article_id)
    .then((article) => {
      res.status(202).send({ article });
    })
    .catch(next);
};
