const express = require("express");
const utils = require("./utils.js");
// Need to figure out what is best placed in utils

const app = express();
app.listen(3005, () => console.log("Listening on port 3005"));

app.use(express.static("./public"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const path = require("path");
//what is the purpose of this? ^

const users = require("./models/users.js");

const tenMins = 1000 * 60 * 10;
const oneHour = 1000 * 60 * 60;

const sessions = require("express-session");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
// const mongoDBPassword=process.env.MONGODBPASSWORD
// const myUniqueDatabase="RoshanApp"

require("dotenv").config();

const mongoose = require("mongoose");
const connectionString = `mongodb+srv://CCO6005-00:black.D0g@cluster0.lpfnqqx.mongodb.net/RoshanApp?retryWrites=true&w=majority`;
mongoose.connect(connectionString);
//OI GET .ENV WORKING AND FIX CONNECTION STRING

const postData = require("./models/post-data.js");

const multer = require("multer");
const upload = multer({ dest: "./public/uploads" });
//Error with upload 'destination never read'


app.post('/profile-edit', upload.single('avatar'), function (req, res) {
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body holds all text fields
   console.log(req.file, req.body)
});



//Add email verification with sendgrid etc! - DON'T DO THIS

app.set("view engine", "ejs");

// res.render allows the loading of a ejs view file

// application page
app.get("/", function (req, res) {
  res.render("pages/application");
});

// login page
app.get("/", function (req, res) {
  res.render("pages/login");
});

// logout page
app.get("/", function (req, res) {
  res.render("pages/logout");
});

// profile page
app.get("/", function (req, res) {
  res.render("pages/profile");
});

// register page
app.get("/", function (req, res) {
  res.render("pages/register");
});

// viewpost page
app.get("/", function (req, res) {
  res.render("pages/viewpost");
});

// app.get('/login')
//   res.render("login.ejs");

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
      response.render("pages/login", {
        isLoggedIn: checkLoggedInState(request),
      });
    }
  }

  function checkLoggedInState(request) {
    return request.session && request.session.userid;
  }
}

app.get("/application", checkLoggedIn, async (request, response) => {
  // response.redirect('./application.html')
  response.render("pages/application", {
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
  });
});
//Check that there isn't issues having both htlm page and ejs pages named 'application'

app.get("/viewpost", checkLoggedIn, async (request, response) => {
  // response.redirect('./application.html')
  let postID = request.query.postid; //'66321bf0fdfeacf1d9fb6e88'
  // console.log(postID)
  let retrievedPost = await postData.getPost(postID);
  // console.log(retrievedPost)
  response.render("pages/viewpost", {
    isLoggedIn: checkLoggedInState(request),
    post: await postData.getPost(postID),
  });
});

app.get("/like", checkLoggedIn, async (request, response) => {
  let postID = request.query.postid;
  await postData.likePost(postID);
  response.render("pages/app", {
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
  });
});

app.post("/comment", checkLoggedIn, async (request, response) => {
  // let postID=request.query.postid
  await postData.commentOnPost(
    request.body.postid,
    request.body.comment,
    request.session.userid
  );
  response.render("pages/viewpost", {
    isLoggedIn: checkLoggedInState(request),
    post: await postData.getPost(request.body.postid),
  });
});

app.get("/register", (request, response) => {
  response.render("pages/register", {
    isLoggedIn: checkLoggedInState(request),
  });
});

app.get("/logout", (request, response) => {
  response.render("pages/logout", {
    isLoggedIn: checkLoggedInState(request),
  });
});

app.get("/profile", (request, response) => {
  response.render("pages/profile", {
    isLoggedIn: checkLoggedInState(request),
  });
});

app.get("/login", (request, response) => {
  response.render("pages/login", {
    isLoggedIn: checkLoggedInState(request),
  });
});

//controller for logout
app.post("/logout", async (request, response) => {
  // users.setLoggedIn(request.session.userid,false)
  request.session.destroy();
  console.log(await users.getUsers());
  response.redirect("./");
});

app.post("/register", async (request, response) => {
  console.log(request.body);
  let userData = request.body;
  // console.log(userData.username)
  if (await users.findUser(userData.username)) {
    console.log("user exists");
    response.json({
      status: "failed",
      error: "user exists",
    });
  } else {
    await users.newUser(userData.username, userData.password);
    response.redirect("/registered.html");
  }
  console.log(await users.getUsers());
});

app.post("/login", async (request, response) => {
  console.log(request.body);
  let userData = request.body;
  console.log(userData);
  if (await users.findUser(userData.username)) {
    console.log("user found");
    //with bcrypt code must be passed as callback
    await users.checkPassword(
      userData.username,
      userData.password,
      async function (isMatch) {
        if (isMatch) {
          console.log("password matches");
          request.session.userid = userData.username;
          response.redirect("/application");
        } else {
          console.log("password wrong");
          response.redirect("/loginfailed.html");
        }
      }
    );
  } else {
    console.log("no such user");
    response.redirect("/loginfailed.html");
  }
});

// app.post("/logout", (request, response) => {
//   users.setLoggedIn(request.session.userid, false);
//   request.session.destroy();
//   console.log(users.getUsers());
//   response.redirect("./loggedout.html");
// });

app.post("/logout", async (request, response) => {
  request.session.destroy();
  console.log(await users.getUsers());
  response.redirect("./");
});

app.post("/post", (request, response) => {
  console.log(request.body);
});

// app.post("/newpost", (request, response) => {
//   console.log(request.body);
//   postData.addNewPost(request.session.userid, request.body.message);
//   response.redirect("./application.html");
// });

app.post("/newpost", upload.single("myImage"), async (request, response) => {
  console.log(request.body);
  console.log(request.session.userid);
  console.log(request.file);
  let filename = null;
  if (request.file && request.file.filename) {
    //check file exists and has a file name
    filename = "uploads/" + request.file.filename;
  }
  postData.addNewPost(request.session.userid, request.body, filename);
  response.render("pages/application", {
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
  });
});
//I DONT WANT USERS MAKING IMAGE POSTS REGULARLY (I DON'T THINK) ASK ABOUT THIS

app.get("/getposts", async (request, response) => {
  response.json({ posts: await postData.getPosts(5) });
});

// function checkLoggedIn(request, response, nextAction) {
//   if (request.session) {
//     if (request.session.userid) {
//       nextAction();
//     } else {
//       request.session.destroy();
//       return response.render("pages/login");
//     }
//   }
// }

// app.get("/app", checkLoggedIn, async (request, response) => {
//   response.render("pages/app", {
//     username: request.session.userid,
//     posts: await postData.getPosts(5),
//   });
// });
//ADD CURRENT PROMPT AS DATA TO THE ABOVE CODE

app.set("view engine", "ejs");

// require('dotenv').config()
// console.log(process.env.SECRET_FILE)

//NOTABLE ISSUE - you can still post when logged out
//NOTABLE ISSUE - post time and likes aren't included in posts printed to app

//8ff97b1aa81488ca6d4cfa588d4fcf4fdcc15eb6
