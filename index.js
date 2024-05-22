const express = require("express");
const utils = require("./utils.js");
//N Need to figure out what is best placed in utils

const app = express();
app.listen(3005, () => console.log("Listening on port 3005"));

app.use(express.static("./public"));

app.use(express.json())

app.use(express.urlencoded({ extended: false }));

const path = require("path");

const users = require("./users.js");

const tenMins = 1000 * 60 * 10;

const sessions = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const mongoose = requre("mongoose");
const connectionString = `mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/${Roshan}?retryWrites=true&w=majority`;
mongoose.connect(connectionString);

app.use(cookieParser());

app.use(
  sessions({
    secret: "a secret that only i know",
    // Replace with .env
    saveUninitialized: true,
    cookie: { maxAge: tenMins },
    resave: false,
  })
);

function checkLoggedIn(request, response, nextAction) {
  if (request.session) {
    if (request.session.userid) {
      nextAction();
    } else {
      request.session.destroy();
      return response.redirect("/notloggedin.html");
    }
  }
}

app.get("/app", checkLoggedIn, (request, response) => {
  response.redirect("./application.html");
});

app.post("/register", (request, response) => {
  console.log(request.body);
  let userData = request.body;
  if (users.findUser(userData.username)) {
    console.log("user exists");
    response.json({
      status: "failed",
      error: "user exists",
    });
  } else {
    users.newUser(userData.username, userData.password);
    response.redirect("/registered.html");
  }
  console.log(users.getUsers());
});

app.post("/login", (request, response) => {
  console.log(request.body);
  let userData = request.body;
  console.log(userData);
  if (users.findUser(userData.username)) {
    console.log("user found");
    if (users.checkPassword(userData.username, userData.password)) {
      console.log("password matches");
      request.session.userid = userData.username;
      users.setLoggedIn(userData.username, true);
      // ^ Does this not require more security?
      response.redirect("/loggedin.html");
    } else {
      console.log("password wrong");
      response.redirect("/loginfailed.html");
    }
  } else {
    console.log("username not found");
    response.redirect("/loginfailed.html");
  }
  console.log(users.getUsers());
});

app.post("/logout", (request, response) => {
  users.setLoggedIn(request.session.userid, false);
  request.session.destroy();
  console.log(users.getUsers());
  response.redirect("./loggedout.html");
});

app.post("/post", (request, response) => {
  console.log(request.body);
});

const postData = require("./posts-data.js");

app.post("/newpost", (request, response) => {
  console.log(request.body);
  postData.addNewPost(request.session.userid, request.body.message);
  response.redirect("./application.html");
});

app.get("/getposts", (request, response) => {
  response.json({ posts: postData.getPosts(5) });
});

function checkLoggedIn(request, response, nextAction) {
  if (request.session) {
    if (request.session.userid) {
      nextAction();
    } else {
      request.session.destroy();
      return response.render("pages/login");
    }
  }
}

app.get("/app", checkLoggedIn, async (request, response) => {
  response.render("pages/app", {
    username: request.session.userid,
    posts: await postData.getPosts(5),
  });
});
//ADD CURRENT PROMPT AS DATA TO THE ABOVE CODE

// add mongoose

const multer = require("multer");
const upload = multer({ dest: "./public/uploads" });

app.set("view engine", "ejs");

// require('dotenv').config()
// console.log(process.env.SECRET_FILE)

//NOTABLE ISSUE - you can still post when logged out
//NOTABLE ISSUE - post time and likes aren't included in posts printed to app

//8ff97b1aa81488ca6d4cfa588d4fcf4fdcc15eb6
