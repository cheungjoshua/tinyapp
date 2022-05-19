const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { redirect } = require("express/lib/response");

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

let users = {};

const generateRandomString = function () {
  let result = "";
  // let longURL = body.longURL;
  const letter =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += letter.charAt(Math.floor(Math.random() * letter.length));
  }
  // urlDatabase[result] = longURL;
  return result;
};

const emptyCheck = function (item) {
  if (item.length < 1) {
    return true;
  }
  return false;
};

const matchCheck = function (users, obj) {
  for (let user in users) {
    console.log(users[user]);
    for (let item in users[user]) {
      if (users[user][item] === obj) {
        return users[user]["id"];
      }
    }
  }
  return false;
};

app.get("/", (req, res) => {
  const id = req.cookies["user_id"];
  console.log("user from users", users[id]);
  if (typeof id === "undefined") {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

// For Login - Get
app.get("/login", (req, res) => {
  res.render("login");
});

// For Login - Post
app.post("/login", (req, res) => {
  let userID = "";
  const email = req.body.email;
  const password = req.body.password;
  if (matchCheck(users, email) === false) {
    res.status(403).send("Error 403 Email cannot be found");
  } else if (matchCheck(users, email) !== false) {
    userID = matchCheck(users, email);
    if (users[userID]["password"] !== password) {
      res.status(403).send("Error 403 Password not match");
    } else {
      res.cookie("user_id", userID);
      res.redirect("/urls");
    }
  }
  // will update using email to login in next exercise
  res.redirect("/urls");
});

// For Logout - Post
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// For Register - Get
app.get("/register", (req, res) => {
  res.render("register");
});

// For Register - Post
app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (emptyCheck(password) || emptyCheck(email)) {
    res.status(400).send("Error 400 Email/Password is empty");
  } else if (matchCheck(users, email) !== false) {
    res.status(400).send("Error 400 Email already been used");
  } else {
    users[userID] = { id: userID, email: email, password: password };
    res.cookie("user_id", userID);
    console.log("Success users", users[userID]); // console log user info when success
    res.redirect("/urls");
  }
});

// For Main URLS - Get
app.get("/urls", (req, res) => {
  const id = req.cookies["user_id"];
  console.log("user from users", users[id]); // show what is the user info by using cookie id
  const templateVars = { urls: urlDatabase, user: users[id] };
  res.render("urls_index", templateVars);
});

// For Main URLS - Post
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies["user_id"];
  console.log("user from users", users[id]);
  if (typeof id === "undefined") {
    res.redirect("/login");
  } else {
    res.render("urls_new");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
