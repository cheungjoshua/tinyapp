/***
 * Used it to check item belong to user or not
 * if belong, return userID
 * else return false
 */
const matchCheck = function (usersDB, obj) {
  for (let user in usersDB) {
    for (let item in usersDB[user]) {
      if (usersDB[user][item] === obj) {
        return usersDB[user]["id"];
      }
    }
  }
  return false;
};

// Generate Random 6 chars long string
const generateRandomString = function () {
  let result = "";
  const letter =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += letter.charAt(Math.floor(Math.random() * letter.length));
  }
  return result;
};

/***
 * Find url from url DB belong to user,
 * return object of url
 */

const urlsForUser = function (list, id) {
  let matchURLS = {};
  for (let link in list) {
    if (list[link]["userID"] === id) {
      matchURLS[link] = list[link]["longURL"];
    }
  }
  return matchURLS;
};

module.exports = { matchCheck, generateRandomString, urlsForUser };
