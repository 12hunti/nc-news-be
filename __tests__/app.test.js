const endpointsJson = require("../endpoints.json");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with the topics object with the correct amount of topics", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body}) => {
      expect(body.topics.length).toBe(3)
    })
  })
  test("responds with the topics objects with each topic containing the correct properties", () => {
    return request(app)
    .get("/api/topics")
    .then(({body}) => {
      const topics = body.topics
      topics.forEach((topic) => {
        const {slug, description, img_url} = topic
        expect(typeof slug).toBe("string")
        expect(typeof description).toBe("string")
        expect(typeof img_url).toBe("string")
      })
    })
  })
  test.todo("404: responds with an error if the topic does not exist")
  test.todo("400: responds with an error if the topic is not valid")
})
