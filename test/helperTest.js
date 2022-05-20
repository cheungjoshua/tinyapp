const { assert } = require("chai");

const { matchCheck, urlsForUser } = require("../helper.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "TsHBL4",
  },
};

describe("matchCheck", function () {
  it("should return a user with valid email", function () {
    const user = matchCheck(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedUserID);
  });
});

describe("urlsForUser", function () {
  it("should return url belong to user", function () {
    const user = urlsForUser(urlDatabase, "TsHBL4");
    const expectedUserID = { i3BoGr: "https://www.google.ca" };
    // Write your assert statement here
    assert.deepEqual(user, expectedUserID);
  });
});
