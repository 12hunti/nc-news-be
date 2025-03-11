const endpointsJson = require("../endpoints.json");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");

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
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
            img_url: expect.any(String)
          })
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with the articles object with with article containing the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
          })
        });
      });
  });
  
  test("responds with the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("returns the articles object without a body property present on any of the article objects", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.body).not.toBe(true);
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the article object from the requested id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
      const {article} = body
        expect(article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        })
      });
  });

  test("404: responds with an error if the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/7893")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });
  test("400: responds with an error if the article_id is invalid", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the requested article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
        });
      });
  });
  test("responds with the comments sorted with the most recent first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: responds with an empty array when there are no comments associated with the article", () => {
    return request(app)
    .get("/api/articles/4/comments")
    .expect(200)
    .then(({body}) => {
      const {comments} = body
      expect(comments).toEqual([])
    })
  })

  test("404: responds with an error if the article_id does not exist", () => {
    return request(app)
    .get("/api/articles/7893/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("resource not found");
    });
  });
  test("400: responds with an error if the article_id is invalid", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
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
