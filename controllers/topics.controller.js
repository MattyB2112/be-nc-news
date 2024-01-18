const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  addArticleComment,
  updateProperty,
  removeComment,
  fetchUsers,
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
  const { topic } = req.query;
  fetchArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
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
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send(users);
  });
};
