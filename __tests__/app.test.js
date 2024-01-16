const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const fs = require("fs/promises");

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
        return fs.readFile("endpoints.json", "utf-8").then((data) => {
          expect(endPoints.text).toEqual(data);
        });
      });
  });
  describe("/api/topics", () => {
    test("GET /api/topics should respond with a status 200 and an array of topic objects", () => {
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
    test("GET /api/topix responds with a 404 not found error as endpoint is misspelled", () => {
      return request(app)
        .get("/api/topix")
        .expect(404)
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body.message).toBe("endpoint not found!");
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
          articles.forEach((article) => {
            expect(article.hasOwnProperty("comment_count")).toBe(true);
          });
        });
    });
    test(" GET /api/articles/ returns correct comment count for each article", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles[0].comment_count).toBe(2);
          expect(articles[1].comment_count).toBe(1);
          expect(articles[2].comment_count).toBe(0);
          expect(articles[3].comment_count).toBe(0);
          expect(articles[4].comment_count).toBe(0);
          expect(articles[5].comment_count).toBe(2);
          expect(articles[6].comment_count).toBe(11);
          expect(articles[7].comment_count).toBe(2);
          expect(articles[8].comment_count).toBe(0);
          expect(articles[9].comment_count).toBe(0);
          expect(articles[10].comment_count).toBe(0);
          expect(articles[11].comment_count).toBe(0);
          expect(articles[12].comment_count).toBe(0);
        });
    });
    test(" GET /api/articles/ returns articles ordered by date in descending order", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect([articles]).toBeSortedBy("created_at", { descending: true });
        });
    });
    test(" GET /api/particles/ returns 404 status and 'not found' message as endpint is misspelled", () => {
      return request(app)
        .get("/api/particles/")
        .expect(404)
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body.message).toBe("endpoint not found!");
        });
    });
    test(" GET /api/articles/1 returns a status 200 and a single corresponding article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
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
    test("GET /api/articles/banana returns a 404 and 'not found' as parameter is invalid", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("not found");
        });
    });
    test("GET /api/articles/100 returns a 400 and error message as parameter is valid but doesn't exist in database", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
  });
});
