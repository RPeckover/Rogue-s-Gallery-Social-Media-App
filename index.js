const express = require("express");
// const utils = require("./utils.js");
// Need to figure out what is best placed in utils

const app = express();
app.listen(3007, () => console.log("Listening on port 3007"));

app.use(express.static("./public"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const users = require("./models/users.js");

const tenMins = 1000 * 60 * 10;
// const oneHour = 1000 * 60 * 60;
// const oneDay = 1000 * 60 * 60 * 24;
// const oneWeek = 1000 * 60 * 60 * 24 * 7;

const sessions = require("express-session");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

require("dotenv").config();
const mongoDBPassword=process.env.MONGODB_PASSWORD;
const myDatabase="roshan_blog";

const mongoose = require("mongoose");
const connectionString = `mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/${myDatabase}?retryWrites=true&w=majority`;
mongoose.connect(connectionString);

const postData = require("./models/post-data.js");

const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "./public/uploads" });

// edit profile functionality
app.post("/profile-edit", checkLoggedIn, upload.single("myPFP"), async (request, response) => {
    console.log(request.body, request.file, request.session.userid);
    console.log(request.file);
    let avatar = null;
     if (request.file && request.file.filename) {
    // checks file exists and has a file name
    avatar = "uploads/" + request.file.filename;
  }
});

// session functionality 
app.use(
  sessions({
    secret: "a secret that only i know",
    // Replace with .env - What exactly is this used for here? Currently ENV only stores the key needed for compass etc, what does the session need to store that is anonymous?
    saveUninitialized: true,
    cookie: { maxAge: tenMins }, 
    // logs a user out after 10 mins - CHECK IF its 10 inactive mins or just 10 mins no matter what
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
}

app.set("view engine", "ejs");

function checkLoggedInState(request) {
  return request.session && request.session.userid;
}

// application EJS page view
app.get("/application", checkLoggedIn, async (request, response) => {
  response.render("pages/application", {
    username: request.session.userid,
    // added to relevent pages so that username is displayed
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
    // ^ update this to get more posts, only display a few per page but display more upon using arrow nav
  });
});

// viewpost EJS page view
app.get("/viewpost", checkLoggedIn, async (request, response) => {
  let postID = request.query.postid; //'66321bf0fdfeacf1d9fb6e88'
  // console.log(postID)
  //let retrievedPost = await postData.getPost(postID);
  // console.log(retrievedPost)
  //Above lines are for testing ^
  response.render("pages/viewpost", {
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
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
  });
});
// NOTE - CURRENTLY USER CAN LIKE A POST MULTIPLE TIMES BY REFRESHING THE PAGE OR JUST CLICKING MULTIPLE TIMES


// functionality for adding comments
app.post("/comment", checkLoggedIn, async (request, response) => {
  // let postID=request.query.postid
  await postData.commentOnPost(
    request.body.postid,
    request.body.comment,
    request.session.userid
  );
  response.render("pages/viewpost", {
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    post: await postData.getPost(request.body.postid),
  });
});

// register EJS page view
app.get("/register", (request, response) => {
  response.render("pages/register", {
    isLoggedIn: checkLoggedInState(request),
  });
});

// logout EJS page view
app.get("/logout", (request, response) => {
  response.render("pages/logout", {
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
  });
});

// profile EJS page view
app.get("/profile", checkLoggedIn, async (request, response) => {
  response.render("pages/profile", {
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
  });
});
// FIXED - USERS PREVIOUSLY NOT LOGGED IN COULD ACCESS THE PROFILE URL AND 'EDIT THEIR PROFILE', ADDING 'checkLoggedIn, async' TO 'app.get()' resolved this issue, comment included for reference if issue arises elsewhere

// login EJS page view
app.get("/login", (request, response) => {
  response.render("pages/login", {
    isLoggedIn: checkLoggedInState(request),
  });
});

// controller for logout
app.post("/logout", async (request, response) => {
  // users.setLoggedIn(request.session.userid,false)
  request.session.destroy();
  console.log(await users.getUsers()); // THIS IS USEFUL FOR TESTING BUT SHOULD BE REMOVED IN FINAL VERSION FOR SECURITY REASONS
  response.redirect("./");
});

// about EJS page view
app.get("/about", (request, response) => {
  response.render("pages/about", {
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
  });
});

// new user registry functionality
app.post("/register", async (request, response) => {
  console.log(request.body);
  let userData = request.body;
  // console.log(userData.username)
  if (await users.findUser(userData.username)) {
    console.log("user exists");
  } else {
    await users.newUser(userData.username, userData.password);
    response.redirect("/application"); 
  }
  console.log(await users.getUsers());
});

// login functionality
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
          console.log("incorrect password");
          console.log(`${userData.password}`);
          response.redirect("/login");
          // Maybe redirect user to login page but also trigger a popover / callout letting the user know the login failed
        }
      }
    );
  } else {
    console.log("no such user");
    response.redirect("/login");
    // Maybe redirect user to login page but also trigger a popover / callout letting the user know the login failed
  }
});

app.post("/post", (request, response) => {
  console.log(request.body);
});
// Was this for testing? ^

// post creation functionality
app.post("/newpost", checkLoggedIn, async (request, response) => {
  console.log(request.body);
  console.log(request.session.userid);
  postData.addNewPost(request.session.userid, request.body);
  response.render("pages/application", {
    username: request.session.userid,
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
  });
});
// NOTE - CURRENTLY USER CAN REFRESH NEWPOST URL TO SPAM POSTS

// post/timeline display functionality
app.get("/getposts", async (request, response) => {
  response.json({ posts: await postData.getPosts(5) });
});
// add ability to go to another page with further posts and curate the main timeline more to whoever is being followed by the logged in user

// require('dotenv').config()
// console.log(process.env.SECRET_FILE)

// function to allow user to delete profile and all posts
async function eraseUser() {
  if (document.querySelector('#eraseTickbox').checked) {// checks the tickbox has been selected, confirming intent to erase the account
    //ADD for loop going through posts, deleting them
    window.alert("account deleted.");
    //ADD delete user
    request.session.destroy();
    response.render("pages/register");// sends user back to register page
} else {
    window.alert("please also tick the checkbox if you would like to erase your account");// alerts user that they must use the tickbox to reset their progress
}
}

async function erasePost() {
  // use 'get one and update'?
}