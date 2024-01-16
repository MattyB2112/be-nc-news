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
    return Promise.reject({ status: 400, message: "bad request" });
  } else
    return db
      .query(`SELECT * FROM articles WHERE article_id = ${paramAsNum}`)
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, message: "not found" });
        }
        return rows;
      });
};

exports.fetchArticles = () => {
  return db.query(`SELECT article_id FROM comments`).then(({ rows }) => {
    const commentIds = rows;
    let commentCount = [];
    commentIds.forEach((comment) => {
      commentCount.push(comment.article_id);
    });
    return db
      .query(
        `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`
      )
      .then(({ rows }) => {
        rows.forEach((row) => {
          row.comment_count = 0;
        });
        rows.forEach((row) => {
          for (let i = 0; i < commentCount.length; i++) {
            if (row.article_id === commentCount[i]) {
              row.comment_count++;
            }
          }
        });
        return rows;
      });
  });
};

exports.fetchArticleComments = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = ${id} ORDER BY created_at ASC`
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      return rows;
    });
};
