const express = require("express");
const app = express();
app.listen(3007, () => console.log("Listening on port 3007"));

app.use(express.static("./public"));
// serves unspecified static pages from the public directory
app.use(express.json());
// enables usage of express middleware for json 

app.use(express.urlencoded({ extended: false }));
// allows for processing post info within urls

const utils = require("./utils.js");
// imports custom utilities node module

const users = require("./models/users.js");
// imports custom user node module

const postData = require("./models/post-data.js");
// imports custom post node module

const promptData = require("./models/prompts.js");
// imports custom prompt node module

const thirtyMins = 1000 * 60 * 30;
// stores session expiry times in ms

const sessions = require("express-session");
// allows usage of the 'sessions' module 
const cookieParser = require("cookie-parser");
// allows useage of the 'cookie-parser' module

app.use(cookieParser());
// enables usage of 'cookie-parser' middleware 

require("dotenv").config();
const mongoDBPassword=process.env.MONGODB_PASSWORD;
// enables use of environment (ENV) files for storing sensitive data
const myDatabase="roshan_blog";
// MongoDB database

const mongoose = require("mongoose");
// imports mongoose ODM library
const connectionString = `mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/${myDatabase}?retryWrites=true&w=majority`;
// 
mongoose.connect(connectionString);
// 

const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "./public/uploads" });

// edit profile controller
app.post("/profileEdit", checkLoggedIn, upload.single("myPFP"), async (request, response) => {
    console.log(request.body, request.file, request.session.userid);
    console.log(request.file);
    let avatar = null;
     if (request.file && request.file.filename) {
    // checks file exists and has a file name
    avatar = "uploads/" + request.file.filename;
    // enable password and username editing too
  }
});

const sessionSecret = process.env.SESSION_SECRET;

// sessions functionality  
app.use(
  sessions({
    // loads and configures the 'sessions' middleware
    secret: sessionSecret,
    // the session secret is a salt for the hash and prevents security vulnerability to spoofing via cookies 
    saveUninitialized: true,
    cookie: { maxAge: thirtyMins }, 
    // logs a user out after 10 mins - CHECK IF its 10 inactive mins or just 10 mins no matter what
    resave: false,
  })
);

function checkLoggedIn(request, response, nextAction) {
// checks user is currently logged in with a valid session
  if (request.session) {
    if (request.session.userid) {
      nextAction();
    } else {
      request.session.destroy();
      response.render("pages/login", {
      // serves the user the '' page view
        isLoggedIn: checkLoggedInState(request),
      });
    }
  }
}

app.set("view engine", "ejs");

function checkLoggedInState(request) {
  return request.session && request.session.userid;
}

// application EJS page view
app.get("/application", checkLoggedIn, async (request, response) => {
  response.render("pages/application", {
    // serves the user the '' page view
    username: request.session.userid,
    // added to relevent pages so that username is displayed
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
    // ^ update this to get more posts, only display a few per page but display more upon using arrow nav
  });
});

// viewpost EJS page view
app.get("/viewpost", checkLoggedIn, async (request, response) => {
  let postID = request.query.postid;
  response.render("pages/viewpost", {
    // serves the user the '' page view
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    post: await postData.getPost(postID),
  });
});

// post liking functionality (paired with the 'likePost' function found in 'posts-data.js')
app.get("/like", checkLoggedIn, async (request, response) => {
  let postID = request.query.postid;
  await postData.likePost(postID);
  response.render("pages/application", {
    // serves the user the 'application' page view
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
  });
});
// NOTE - CURRENTLY USER CAN LIKE A POST MULTIPLE TIMES BY REFRESHING THE PAGE OR JUST CLICKING MULTIPLE TIMES


// controller for adding comments
app.post("/comment", checkLoggedIn, async (request, response) => {
  // let postID=request.query.postid
  await postData.commentOnPost(
    request.body.postid,
    request.body.comment,
    request.session.userid
  );
  response.render("pages/viewpost", {
    // serves the user the 'viewpost' page view
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    post: await postData.getPost(request.body.postid),
  });
});

// register EJS page view
app.get("/register", (request, response) => {
  response.render("pages/register", {
    // serves the user the 'register' page view
    isLoggedIn: checkLoggedInState(request),
  });
});

// logout EJS page view
app.get("/logout", (request, response) => {
  response.render("pages/logout", {
    // serves the user the 'logout' page view
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
  });
});

// profile EJS page view
app.get("/profile", checkLoggedIn, async (request, response) => {
  response.render("pages/profile", {
    // serves the user the '' page view
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
  });
});

// login EJS page view
app.get("/login", (request, response) => {
  response.render("pages/login", {
    // serves the user the '' page view
    isLoggedIn: checkLoggedInState(request),
  });
});

// controller for logout
app.post("/logout", async (request, response) => {
  request.session.destroy();
  response.redirect("./");
  // serves the user the '' page view
});

// about EJS page view
app.get("/about", (request, response) => {
  response.render("pages/about", {
    // serves the user the '' page view
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
  });
});

// new user registry controller
app.post("/register", async (request, response) => {
  console.log(request.body);
  let userData = request.body;
  if (await users.findUser(userData.username)) {
  // checks existing users for a matching username
    window.alert("This username already exists");
    // alerts user that their username is not available
  } else {
    await users.newUser(userData.username, userData.password);
    response.redirect("/application"); 
    // serves the user the '' page view
  }
});

// controller for login
app.post("/login", async (request, response) => {
  console.log(request.body);
  let userData = request.body;
  console.log(userData); // remove
  if (await users.findUser(userData.username)) {
    console.log("user found");
    // with bcrypt code must be passed as callback
    await users.checkPassword(
      userData.username,
      userData.password,
      async function (isMatch) {
        if (isMatch) {
          console.log("password matches");
          request.session.userid = userData.username;
          response.redirect("/application");
          // serves the user the '' page view
        } else {
          window.alert("Incorrect password");
          // alerts user that the password they have used is incorrect
          response.redirect("/login");
          // serves the user the '' page view
        }
      }
    );
  } else {
    window.alert("No such user exists");
    // alerts user that the username they input doesn't belong to an existing user
    response.redirect("/login");
    // serves the user the '' page view
  }
});

// controller for post creation 
app.post("/newpost", checkLoggedIn, async (request, response) => {
  postData.addNewPost(request.session.userid, request.body);
  response.render("pages/application", {
    // serves the user the '' page view
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
  });
});
// currently user can refresh newpost url to spam posts

// post/timeline display functionality
app.get("/getposts", async (request, response) => {
  response.json({ posts: await postData.getPosts(5) });
});
// add ability to go to another page with further posts and curate the main timeline more to whoever is being followed by the logged in user