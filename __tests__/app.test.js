const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const fs = require("fs/promises");
const endPointsFile = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api", () => {
  test("GET /api should respond with a list and description of all available endpoinds", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((endPoints) => {
        const parsedEndpoints = JSON.parse(endPoints.text);
        expect(parsedEndpoints).toEqual(endPointsFile);
      });
  });
});
describe("/api/something_invalid", () => {
  test("returns a status 404 and not found error as endpoint is misspelled", () => {
    return request(app)
      .get("/api/something_invalid")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("endpoint not found!");
      });
  });
});
describe("/api/topics", () => {
  test("returns a status 200 and an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
describe("/GET api/articles", () => {
  test(" GET /api/articles/ returns an array", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
      });
  });
  test(" GET /api/articles/ returns a status 200 and all articles information except for body", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test(" GET /api/articles/ returns a status 200 and a comment_count property on all articles", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article.hasOwnProperty("comment_count")).toBe(true);
        });
      });
  });
  test(" GET /api/articles/ returns articles ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at");
      });
  });
});
describe("get /api/articles/:article_id", () => {
  test("returns a status 200 and a single corresponding article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article[0];
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET /api/articles/banana returns a 400 and 'bad request' as parameter is invalid", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("GET /api/articles/100 returns a 404 and error message as parameter is valid but doesn't exist in database", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("returns an array", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });
  test("returned array has desired properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(11);
        body.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("returned array is ordered by most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect([body]).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("invalid article id sends 400 error and message", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("valid but non existent article id sends 404 error and message", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("article with no comments returns a 200 and empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("responds with the posted comment", () => {
    const comment = { username: "butter_bridge", body: "Hello world!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        const postedComment = body.comment;
        expect(typeof postedComment.comment_id).toBe("number");
        expect(typeof postedComment.body).toBe("string");
        expect(typeof postedComment.article_id).toBe("number");
        expect(typeof postedComment.author).toBe("string");
        expect(typeof postedComment.votes).toBe("number");
        expect(typeof postedComment.created_at).toBe("string");
      });
  });
  test("responds with status 400 and 'bad request' if username does not exist in database", () => {
    const comment = { username: "banana", body: "Hello world!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("username not found");
      });
  });
  test("responds with status 400 and 'bad request' if comment body is undefined", () => {
    const comment = { username: "butter_bridge", body: undefined };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("responds with status 400 and 'bad request' if article_id endpoint is valid but non-existent", () => {
    const comment = { username: "butter_bridge", body: "Hello world!" };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article not found");
      });
  });
  test("responds with status 404 and 'endpoint not found!' if articles is missppelled in endpoint", () => {
    const comment = { username: "butter_bridge", body: "Hello world!" };
    return request(app)
      .post("/api/banana/1/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("endpoint not found!");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("returns an object", () => {
    const propToUpdate = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(propToUpdate)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(typeof article).toBe("object");
      });
  });
  test("returns the article desired", () => {
    const propToUpdate = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(propToUpdate)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("updates object property by desired amount", () => {
    const propToUpdate = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(propToUpdate)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.votes).toBe(150);
      });
  });
  test("invalid form of object passed in returns status 400 and error message", () => {
    const propToUpdate = { inc_votes: "banana" };
    return request(app)
      .patch("/api/articles/1")
      .send(propToUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("valid but non-existent article_id returns status 404 and error message", () => {
    const propToUpdate = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/99999")
      .send(propToUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("invalid article path returns status 400 and error message", () => {
    const propToUpdate = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/banana")
      .send(propToUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("returns deleted comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.article_id).toBe("number");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("valid but non-existent comment_id returns 404 and error message", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("invalid comment_id returns 400 and error message", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});
describe("GET /api/users", () => {
  test("returns all user data", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user.hasOwnProperty("username")).toBe(true);
          expect(user.hasOwnProperty("name")).toBe(true);
          expect(user.hasOwnProperty("avatar_url")).toBe(true);
        });
      });
  });
});
describe("GET /api/articles by query", () => {
  test("returns all articles with specified topic", () => {
    return request(app)
      .get("/api/articles/?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(1);
        expect(typeof articles[0].author).toBe("string");
        expect(typeof articles[0].title).toBe("string");
        expect(typeof articles[0].article_id).toBe("number");
        expect(articles[0].topic).toBe("cats");
        expect(typeof articles[0].created_at).toBe("string");
        expect(typeof articles[0].votes).toBe("number");
        expect(typeof articles[0].article_img_url).toBe("string");
        expect(typeof articles[0].comment_count).toBe("string");
      });
  });
  test("returns all articles if passed no query", () => {
    return request(app)
      .get("/api/articles/?topic=")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
      });
  });
  test("valid topic with no articles returns empty array", () => {
    return request(app)
      .get("/api/articles/?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles.length).toBe(0);
      });
  });
  test("invalid topic query returns status 400 and error message", () => {
    return request(app)
      .get("/api/articles/?topic=youguessedit-bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
});
describe("Adding new feature to GET /api/articles/:article_id", () => {
  test("adds comment_count property to returned article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article[0];
        expect(article.comment_count).toBe("11");
      });
  });
});
describe("Adding new feature to sort GET /api/articles by query", () => {
  test("can sort by any valid query", () => {
    return request(app)
      .get("/api/articles/?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("votes");
      });
  });
  test("can order by DESC if specified", () => {
    return request(app)
      .get("/api/articles/?sort_by=votes&order=DESC")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("can use all 3 possible parameters together", () => {
    return request(app)
      .get("/api/articles/?topic=mitch&sort_by=votes&order=DESC")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("votes", { descending: true });
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("invalid order query returns status 400 and error message", () => {
    return request(app)
      .get("/api/articles/?sort_by=created_at&order=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid query");
      });
  });
  test("invalid sort_by query returns status 400 and error message", () => {
    return request(app)
      .get("/api/articles/?sort_by=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid query");
      });
  });
});
