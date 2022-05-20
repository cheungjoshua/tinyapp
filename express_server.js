const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const { matchCheck, generateRandomString, urlsForUser } = require("./helper");

const app = express();
const PORT = 8080;

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
// For testing  - Urls database
let urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "TsHBL4",
  },
};
// For testing  - Users database
let users = {
  TsHBL4: {
    id: "TsHBL4",
    email: "aa@a.com",
    password: "$2a$10$LEYlimE7TMXdg4GvVJeJ0uG.O6KytwF4xoNLUfEpfPo4FktjI9yO.",
  },
  XtSlkc: {
    id: "XtSlkc",
    email: "bb@b.com",
    password: "$2a$10$3x3T7TJPI7zptJ.l./TgoOSvZTYWd/G/Ak6ahpKIf3ojVmjXhvMTa",
  },
};

app.get("/", (req, res) => {
  // Check user login or not
  const id = req.session.user_id;
  if (typeof id === "undefined") {
    // redirect to login page if not login
    res.redirect("/login");
  } else {
    // else redirect to url main page
    res.redirect("/urls");
  }
});

// Get - Login
app.get("/login", (req, res) => {
  // Check user login or not
  const id = req.session.user_id;
  if (typeof id !== "undefined") {
    // redirect to url main page if logged in
    return res.redirect("/urls");
  }
  res.render("login");
});

// Post - Login
app.post("/login", (req, res) => {
  // Check user login or not
  const id = req.session.user_id;
  if (typeof id !== "undefined") {
    // If logged in redirect to url main page
    return res.redirect("/urls");
  }
  let userID = "";
  const email = req.body.email;
  const password = req.body.password;

  // Use function to check email. if not find error
  if (matchCheck(users, email) === false) {
    return res.status(403).send("Error 403 Email cannot be found");
  }
  // If email found, check password next
  if (matchCheck(users, email) !== false) {
    userID = matchCheck(users, email);
    if (!bcrypt.compareSync(password, users[userID]["password"])) {
      //If password not found, send error
      res.status(403).send("Error 403 Password not match");
    } else {
      //all pass, set cookie with session
      req.session.user_id = userID;
      res.redirect("/urls");
    }
  }
});

// Post - logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Get - Register
app.get("/register", (req, res) => {
  // Check user login or not
  const id = req.session.user_id;
  if (typeof id !== "undefined") {
    // redirect to main page if logged in
    return res.redirect("/urls");
  }
  res.render("register");
});

// Post - Register
app.post("/register", (req, res) => {
  console.log("userDB", users);
  // generate random 6 chars long string
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  // hash password
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!password || !email) {
    //if either password or email field empty send error
    return res.status(400).send("Error 400 Email/Password is empty");
  }
  if (matchCheck(users, email) !== false) {
    // if email used in DB, send error
    return res.status(400).send("Error 400 Email already been used");
  }
  // all passed, create user object and add to DB
  users[userID] = { id: userID, email: email, password: hashedPassword };
  req.session.user_id = userID;
  console.log("Success users", users[userID]); // console log user info when success
  res.redirect("/urls");
});

// Get - URLS
app.get("/urls", (req, res) => {
  // Check user login or not
  const id = req.session.user_id;
  if (typeof id === "undefined") {
    return res.redirect("/login");
  } // show url main page if logged in
  const urls = urlsForUser(urlDatabase, id);
  const templateVars = { urls: urls, user: users[id] };
  res.render("urls_index", templateVars);
});

// Post - URLS
app.post("/urls", (req, res) => {
  //get userID, shortURL , longURL , timestamp
  const id = req.session.user_id;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const created = new Date().getTime();

  //create short URL object and add to DB
  urlDatabase[shortURL] = { longURL: longURL, userID: id, created: created };
  res.redirect(`/urls/${shortURL}`);
});

// For shortURL redirect link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  const shortURL = req.params.shortURL;
  if (typeof shortURL === "undefined") {
    res.send("Error");
  }
  res.redirect(longURL);
});

// Get - Create short URL Page
app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const templateVars = { urls: urlDatabase, user: users[id] };
  if (typeof id === "undefined") {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

// Post - Delete shortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.user_id;
  const shortURL = req.params.shortURL;
  // check short URL belong to user or not
  if (urlDatabase[shortURL]["userID"] === id) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");

    // If belong delete, else send error
  } else {
    res.status(400).send("Error: ShortURL not allow to delete");
  }
});

// Post - Edit/Update short URL
app.post("/urls/:shortURL/update", (req, res) => {
  const id = req.session.user_id;
  const shortURL = req.params.shortURL;
  // check short URL belong to user or not
  if (urlDatabase[shortURL]["userID"] === id) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect("/urls");

    // If belong edit, else send error
  } else {
    res.status(400).send("Error: ShortURL not allow to edit");
  }
});

// Get - Show short URL created
app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  const shortURL = req.params.shortURL;
  // check short URL belong to user or not
  if (urlDatabase[shortURL]["userID"] === id) {
    const templateVars = {
      shortURL: shortURL,
      longURL: urlDatabase[shortURL]["longURL"],
    };
    res.render("urls_show", templateVars);

    // If belong Show the created short URL , else send error
  } else {
    res.status(400).send("Error: ShortURL not allow to edit");
  }
});

// Listen Port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
