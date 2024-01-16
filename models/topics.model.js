const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchEndpoints = () => {
  return fs.readFile("endpoints.json", "utf-8").then((data) => {
    return data;
  });
};

exports.fetchArticleById = (id) => {
  const paramAsNum = Number(id);
  if (Number.isNaN(paramAsNum)) {
    return Promise.reject({ status: 404, message: "not found" });
  } else
    return db
      .query(`SELECT * FROM articles WHERE article_id=${id}`)
      .then(({ rows }) => {
        return rows[0];
      });
};
