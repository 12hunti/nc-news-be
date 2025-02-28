const {
  convertTimestampToDate,
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
  createArticleLookup,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("formatTopics", () => {
  test("when passed an empty array returns an empty array", () => {
    expect(formatTopics([])).toEqual([]);
  });
  test("when passed an array containing one topics object, returns an array containing a nested topic array", () => {
    const topicsInput = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
        img_url: "",
      },
    ];
    const returnValue = [["The man, the Mitch, the legend", "mitch", ""]];
    expect(formatTopics(topicsInput)).toEqual(returnValue);
  });
  test("when passed an array containing multiple topic objects, returns an array containing nested topic arrays", () => {
    const topicsInput = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
        img_url: "",
      },
      {
        description: "Not dogs",
        slug: "cats",
        img_url: "",
      },
      {
        description: "what books are made of",
        slug: "paper",
        img_url: "",
      },
    ];
    const returnValue = [
      ["The man, the Mitch, the legend", "mitch", ""],
      ["Not dogs", "cats", ""],
      ["what books are made of", "paper", ""],
    ];
    expect(formatTopics(topicsInput)).toEqual(returnValue);
  });
  test.todo("does not mutate the input");
});

describe("formatUsers", () => {
  test("when passed an empty array returns an empty array", () => {
    expect(formatUsers([])).toEqual([]);
  });
  test("when passed an array containing one users object, returns an array containing a nested user array", () => {
    const usersInput = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
    ];
    const returnValue = [
      [
        "butter_bridge",
        "jonny",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      ],
    ];
    expect(formatUsers(usersInput)).toEqual(returnValue);
  });
  test("when passed an array containing multiple user objects, returns an array containing nested user arrays", () => {
    const usersInput = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
      {
        username: "rogersop",
        name: "paul",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      },
    ];
    const returnValue = [
      [
        "butter_bridge",
        "jonny",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      ],
      [
        "icellusedkars",
        "sam",
        "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      ],
      [
        "rogersop",
        "paul",
        "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      ],
    ];
    expect(formatUsers(usersInput)).toEqual(returnValue);
  });
  test.todo("does not mutate the input");
});

describe("formatArticles", () => {
  test("when passed an empty array returns an empty array", () => {
    expect(formatArticles([])).toEqual([]);
  });
  test("when passed an array containing one Comments object, returns an array containing a nested article array", () => {
    const articlesInput = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const returnValue = [
      [
        "Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date(1594329060000),
        100,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      ],
    ];
    expect(formatArticles(articlesInput)).toEqual(returnValue);
  });
  test("when passed an array containing multiple article objects, returns an array containing nested article arrays", () => {
    const articlesInput = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1602828180000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1604394720000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const returnValue = [
      [
        "Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date(1594329060000),
        100,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      ],
      [
        "Sony Vaio; or, The Laptop",
        "mitch",
        "icellusedkars",
        "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        new Date(1602828180000),
        0,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      ],
      [
        "Eight pug gifs that remind me of mitch",
        "mitch",
        "icellusedkars",
        "some gifs",
        new Date(1604394720000),
        0,
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      ],
    ];
    expect(formatArticles(articlesInput)).toEqual(returnValue);
  });
  test.todo("does not mutate the input");
});

xdescribe("createCommentLookup", () => {
  test("when passed an empty array, returns an empty object", () => {
    expect(createArticleLookup([])).toEqual({});
  });
  test("when passed an array containing one article object, returns an object containing the article title and article_id linked", () => {
    const articleInput = [
      {
        article_id: 1, //if not included fails... how to fix
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const returnValue = { 'Living in the shadow of a great man': 1 };
    expect(createArticleLookup(articleInput)).toEqual(returnValue);
  });
  test("when passed multiple article objects, returns the article titles and article_ids all linked", () => {
    const articleInput = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1602828180000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1604394720000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const returnValue = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3
    };
    expect(createArticleLookup(articleInput)).toEqual(returnValue);
  });
  test("does not mutate the input", () => {
    const articleInput = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const articleOutput = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    createArticleLookup(articleInput);
    expect(articleInput).toEqual(articleOutput);
  });
});

xdescribe("formatComments", () => {
  test("when passed an two empty arrays returns an empty array", () => {
    expect(formatComments([], [])).toEqual([]);
  });
  test("when passed an array containing one Comments object, returns an array containing a nested comment array", () => {
    const commentsInput = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];
    const articleInput = [
      {
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 1591438200000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const returnValue = [
      [
        1,
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!", 
        16,
       "butter_bridge",
        new Date(1586179020000),
      ],
    ];
    expect(formatComments(commentsInput, articleInput)).toEqual(returnValue);
  });
  test("when passed an array containing multiple comment objects, returns an array containing nested comment arrays", () => {
    const commentsInput = [
      {
        article_title: "Living in the shadow of a great man",
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        votes: 100,
        author: "icellusedkars",
        created_at: 1583025180000,
      },
      {
        article_title: "Eight pug gifs that remind me of mitch",
        body: "Ambidextrous marsupial",
        votes: 0,
        author: "icellusedkars",
        created_at: 1600560600000,
      },
    ];
    const articleInput = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1604394720000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const returnValue = [
      [
        1,
        "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        100,
        "icellusedkars",
        new Date(1583025180000),
      ],
      [
        2,
        "Ambidextrous marsupial",
        0,
        "icellusedkars",
        new Date(1600560600000),
      ],
    ];
    expect(formatComments(commentsInput, articleInput)).toEqual(returnValue);
  });
  test("does not mutate the input", () => {
    const commentsInput = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];
    const articleInput = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const expectedComments = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];
    formatComments(commentsInput, articleInput);
    expect(commentsInput).toEqual(expectedComments);
  });
});
