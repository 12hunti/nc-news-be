const db = require("../../db/connection");
const { userData, articleData, commentData } = require("../data/test-data");
const format = require("pg-format");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

const formatTopics = (topicData) => {
  return topicData.map((topic) => {
    return [topic.description, topic.slug, topic.img_url];
  });
};

const formatUsers = (userData) => {
  return userData.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });
};

const formatArticles = (articleData) => {
  return articleData.map((article) => {
    const updatedArticle = convertTimestampToDate(article);
    return [
      updatedArticle.title,
      updatedArticle.topic,
      updatedArticle.author,
      updatedArticle.body,
      updatedArticle.created_at,
      updatedArticle.votes || 0,
      updatedArticle.article_img_url,
    ];
  });
};

const createArticleLookup = (insertedArticles) => {
  if (insertedArticles.length === 0) {
    return {};
  }
  const articleLookup = {};
  insertedArticles.forEach((article) => {
    articleLookup[article.title] = article.article_id;
  });
  return articleLookup;
};

const formatComments = (commentData, insertArticles) => {
  const articleLookup = createArticleLookup(insertArticles);

  if (commentData.length === 0) {
    return [];
  }
  const rearrangedComments = [];

  commentData.forEach((comment) => {
    const formatComment = {
      ...comment,
      article_id: articleLookup[comment.article_title],
    };
    delete formatComment.article_title;
    rearrangedComments.push(formatComment);
  });

  const formattedComments = rearrangedComments.map((comment) => {
    const updatedComment = convertTimestampToDate(comment);
    return [
      updatedComment.article_id,
      updatedComment.body,
      updatedComment.votes,
      updatedComment.author,
      updatedComment.created_at,
    ];
  });

  return formattedComments;
};

const checkExists = (table, column, value) => {
  const queryString = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  return db.query(queryString, [value]).then(({rows}) => {
    if (rows.length === 0){
      return Promise.reject({ status: 404, msg: "resource not found" })
    }
    return true
  })
  .catch((err) => {
    return Promise.reject(err)
  })
};

module.exports = {
  convertTimestampToDate,
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
  createArticleLookup,
  checkExists,
};
