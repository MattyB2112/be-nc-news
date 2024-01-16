const {
  fetchTopics,
  fetchEndpoints,
  fetchArticleById,
  fetchArticles,
} = require("../models/topics.model.js");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getEndpoints = (req, res) => {
  fetchEndpoints().then((endpoints) => {
    res.status(200).send(endpoints);
  });
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
