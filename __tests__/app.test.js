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
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
      });
  });
  test("responds with the topics objects with each topic containing the correct properties", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const topics = body.topics;
        topics.forEach((topic) => {
          const { slug, description, img_url } = topic;
          expect(typeof slug).toBe("string");
          expect(typeof description).toBe("string");
          expect(typeof img_url).toBe("string");
        });
      });
  });
});

describe("invalid path request", () => {
  test("404: responds with an error if the path does not exist", () => {
    return request(app)
      .get("/api/doesntexist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the article object from the request id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const {
          article_id,
          title,
          topic,
          author,
          created_at,
          votes,
          article_img_url,
        } = body.article;
        expect(article_id).toBe(2);
        expect(typeof title).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof author).toBe("string");
        expect(typeof body.article.body).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
      });
  });
  test("404: responds with an error if the article_id does not exist", () => {
    return request(app)
    .get("/api/articles/7893")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("article_id not found")
    })
  });
  test("400: responds with an error if the article_id is invalid", () => {
    return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("bad request")
    })
  });
});
