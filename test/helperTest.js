const { assert } = require("chai");

const { matchCheck } = require("../helper.js");

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

describe("matchCheck", function () {
  it("should return a user with valid email", function () {
    const user = matchCheck(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedUserID);
  });
});
