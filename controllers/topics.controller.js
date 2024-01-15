const { fetchTopics, fetchEndpoints } = require("../models/topics.model.js");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getEndpoints = (req, res) => {
  fetchEndpoints().then((endpoints) => {
    res.status(200).send(endpoints);
  });
};
