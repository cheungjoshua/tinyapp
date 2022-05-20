const { assert } = require("chai");

<<<<<<< HEAD
const { matchCheck, urlsForUser } = require("../helper.js");
=======
const { matchCheck } = require("../helper.js");
>>>>>>> 4b42a56dc058fb42a69088f116c1090ea917913e

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

<<<<<<< HEAD
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

=======
>>>>>>> 4b42a56dc058fb42a69088f116c1090ea917913e
describe("matchCheck", function () {
  it("should return a user with valid email", function () {
    const user = matchCheck(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedUserID);
  });
});
<<<<<<< HEAD

describe("urlsForUser", function () {
  it("should return url belong to user", function () {
    const user = urlsForUser(urlDatabase, "TsHBL4");
    const expectedUserID = { i3BoGr: "https://www.google.ca" };
    // Write your assert statement here
    assert.deepEqual(user, expectedUserID);
  });
});
=======
>>>>>>> 4b42a56dc058fb42a69088f116c1090ea917913e
