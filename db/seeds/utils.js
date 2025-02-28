const db = require("../../db/connection");
const { userData, articleData, commentData } = require("../data/test-data");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.formatTopics = (topicData) => {
  return topicData.map((topic) => {
    return [topic.description, topic.slug, topic.img_url];
  });
};

exports.formatUsers = (userData) => {
  return userData.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });
};

exports.formatArticles = (articleData) => {
  return articleData.map((article) => {
    const updatedArticle = this.convertTimestampToDate(article);
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

exports.createArticleLookup = (insertedArticles) => {
  if (insertedArticles.length === 0) {
    return {};
  }
  const articleLookup = {};
  insertedArticles.forEach((article) => {
    articleLookup[article.title] = article.article_id;
  });
  console.log('articleLookup:', articleLookup) //format comments tests id undefined
  return articleLookup;
};

exports.formatComments = (commentData, insertArticles) => {
   const articleLookup = this.createArticleLookup(insertArticles);
  console.log('articleLookup in formatComments:', articleLookup) // returning id undefined
  if (commentData.length === 0) {
    return [];
  }
  const rearrangedComments = [];

  commentData.forEach((comment) => {
    console.log('Looking up article_id for comment:', comment.article_title) //working 
    const formatComment = {
      ...comment,
      article_id: articleLookup[comment.article_title],
    };
    console.log('Mapped article_id:', formatComment.article_id) //undefined
    delete formatComment.article_title;
    rearrangedComments.push(formatComment);
  });
  
  const formattedComments = rearrangedComments.map((comment) => {
    const updatedComment = this.convertTimestampToDate(comment);
    return [
      updatedComment.article_id,
      updatedComment.body,
      updatedComment.votes,
      updatedComment.author,
      updatedComment.created_at,
    ];
  })

  return formattedComments;
};




  