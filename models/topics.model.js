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

// endpoints.json
