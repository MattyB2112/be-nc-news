const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      return rows;
    });
};

exports.fetchArticles = (query) => {
  if (query) {
    return db
      .query(`SELECT * FROM topics WHERE slug = $1`, [query])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, message: "not found" });
        } else
          return db
            .query(
              `SELECT articles.author, articles.title,articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.topic = $1 GROUP BY articles.article_id ORDER BY articles.created_at ASC`,
              [query]
            )
            .then(({ rows }) => {
              return rows;
            });
      });
  } else
    return db
      .query(
        `SELECT articles.author, articles.title,articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at ASC`
      )
      .then(({ rows }) => {
        return rows;
      });
};

exports.fetchArticleComments = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      } else
        return db
          .query(
            `SELECT * FROM comments WHERE article_id = ${id} ORDER BY created_at ASC`
          )
          .then(({ rows }) => {
            return rows;
          });
    });
};

exports.addArticleComment = (comment, article_id) => {
  const { body, username } = comment;
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "username not found" });
      } else {
        return db
          .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({
                status: 404,
                message: "article not found",
              });
            } else
              return db
                .query(
                  "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
                  [body, username, article_id]
                )
                .then(({ rows }) => {
                  return rows[0];
                });
          });
      }
    });
};

exports.updateProperty = (votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }

      return rows[0];
    });
};

exports.removeComment = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      return rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};
