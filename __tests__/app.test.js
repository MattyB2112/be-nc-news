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
});
