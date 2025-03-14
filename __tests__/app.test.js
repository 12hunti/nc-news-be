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
            img_url: expect.any(String),
          });
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
            article_img_url: expect.any(String),
          });
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

describe("GET /api/articles?sort_by=", () => {
  test("200: responds with the articles sorted by created_at descending", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: responds with the articles sorted by votes descending", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("200: responds with the articles sorted by author descending", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("200: responds with the articles sorted by topic descending", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("200: responds with the articles sorted by title descending", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: responds with the articles sorted by created_at descending when no sort by key is given", () => {
    return request(app)
      .get("/api/articles?sort_by=")
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: responds with an error if the sort key is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=1234")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort by value");
      });
  });
  test("400: responds with an error if the column specified is not an allowed input", () => {
    return request(app)
      .get("/api/articles?sort_by=slug")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort by value");
      });
  });
});

describe("GET /api/articles?sort_by=&order=", () => {
  test("200: responds articles ordered descending", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: responds articles ordered ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("topic", { descending: false });
      });
  });
  test("200: responds with articles sorted by created_at when sorted by is not specified but order is", () => {
    return request(app)
      .get("/api/articles?sorted_by=&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("400: responds with an error if the order key is not asc or desc", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=other")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid order value");
      });
  });
  test("400: responds with an error if the order key is not asc or desc and sort_by isn't specified", () => {
    return request(app)
      .get("/api/articles?order=other")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid order value");
      });
  });
  test("400: responds with an error if the sort key is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=1234&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort by value");
      });
  });
});

describe("GET /api/articles?topic=", () => {
  test("200: responds with the articles of the specified topic value", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("200: responds with all of the articles if the topic is omitted", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
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
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("200: responds with an empty array if no articles are found for a given topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(body.articles.length).toBe(0);
        expect(articles).toEqual([]);
      });
  });
  test("400: responds with an error if the topic is invalid", () => {
    return request(app)
      .get("/api/articles?topic=notatopic")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid topic value");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the article object from the requested id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });

  test("200: responds with the comment_count property for the article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(11);
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
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });

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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: creates a new comment object and inserts the comment into the database, responding with the inserted comment", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        author: "butter_bridge",
        body: "test comment",
      })
      .expect(201)
      .then(({ body }) => {
        const { newComment } = body;
        expect(newComment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "test comment",
          article_id: 4,
        });
      });
  });
  test("404: responds with an error if an author doesn't exist", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        author: "notauser",
        body: "test comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("author not found");
      });
  });
  test("400: responds with an error if sent a body with incorrect fields", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        votes: 5,
        topic: "topic",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with an error if sent an invalid value for a field", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        author: 123,
        body: "test comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with an error when one of the fields is missing from the request", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        body: "test comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with an error when passed an empty object", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with an error if the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/45376/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("resource not found");
      });
  });
  test("400: responds with an error if the article_id is invalid", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: resonds with the article object votes property updated when votes are added", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        inc_votes: 10,
      })
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 10,
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: resonds with the article object votes property updated when votes are subtracted", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -50,
      })
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 50,
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: responds with an error if sent an invalid value for the field", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({
        title: "new title",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with an error if sent an invalid value for the votes", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({
        votes: ["add 5 votes"],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
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

describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with the status code and no content", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("400: responds with an error if the comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/apple")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with an error if the article_id does not exist", () => {
    return request(app)
      .delete("/api/comments/7633")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("resource not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: responds with the comment object votes property updated when votes are added", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({
        inc_votes: 30,
      })
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toMatchObject({
          article_id: expect.any(Number),
          body: expect.any(String),
          votes: 130,
          author: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("200: responds with the comments object votes property updated when the votes are subtracted", () => {
      return request(app)
      .patch("/api/comments/3")
      .send({
        inc_votes: -70,
      })
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toMatchObject({
          article_id: expect.any(Number),
          body: expect.any(String),
          votes: 30,
          author: expect.any(String),
          created_at: expect.any(String),
        });
      });
    }
  );
  test("400: responds with an error if sent an invalid value for the field", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({
        title: "new title",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  }
  );
  test("400: responds with an error if sent an invalid value for the votes", () => {
    return request(app)
      .patch("/api/comments/6")
      .send({
        votes: ["add 15 votes"],
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  }
  );
  test("404: responds with an error if the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/7633")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("resource not found");
      });
  });
  test.todo("400: responds with an error if the comment_id is invalid");
});

describe("GET /api/users", () => {
  test("200: responds with the users object with with user containing the correct properties", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with the user from the requested username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          username: "butter_bridge",
          avatar_url: expect.any(String),
          name: expect.any(String),
        });
      });
  });
  test("404: responds with an error if the username doesn't exist", () => {
    return request(app)
      .get("/api/users/notauser")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
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
