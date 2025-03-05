const db = require("../connection");
const format = require("pg-format");
const {
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
} = require("./utils");


const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return createTopics();
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createArticles();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      const formattedTopicsData = formatTopics(topicData);
      const insertTopics = format(
        `INSERT INTO topics (description, slug, img_url) VALUES %L RETURNING *;`,
        formattedTopicsData
      );
      return db.query(insertTopics);
    })
    .then(() => {
      const formattedUserData = formatUsers(userData);
      const insertUsers = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        formattedUserData
      );
      return db.query(insertUsers);
    })
    .then(() => {
      const formattedArticlesData = formatArticles(articleData);
      const insertArticles = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formattedArticlesData
      );
      return db.query(insertArticles);
    })
    .then(({rows}) => {
      const formattedCommentsData = formatComments(commentData, rows);
      const insertComments = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *`, formattedCommentsData
      )
      return db.query(insertComments)
    })

};

function createTopics() {
  return db.query(`CREATE TABLE IF NOT EXISTS topics (
  slug VARCHAR PRIMARY KEY, 
  description VARCHAR NOT NULL,
  img_url VARCHAR(1000));`);
}

function createUsers() {
  return db.query(`CREATE TABLE IF NOT EXISTS users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR(1000))`);
}

function createArticles() {
  return db.query(`CREATE TABLE IF NOT EXISTS articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES topics(slug),
    author VARCHAR NOT NULL REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000))`);
}

function createComments() {
  return db.query(`CREATE TABLE IF NOT EXISTS comments(
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR NOT NULL REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
}

module.exports = seed;


