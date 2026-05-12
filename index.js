const express = require("express");
const utils = require("./utils.js");
// Need to figure out what is best placed in utils

const app = express();
app.listen(3007, () => console.log("Listening on port 3007"));

app.use(express.static("./public"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const path = require("path");
//what is the purpose of this? ^

const users = require("./models/users.js");

const tenMins = 1000 * 60 * 10;
const oneHour = 1000 * 60 * 60;
const oneDay = 1000 * 60 * 60 * 24;
const oneWeek = 1000 * 60 * 60 * 24 * 7;

//Make prompts have a maxAge of one day

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
const upload = multer({ dest: "./public/uploads" });
//Error with upload 'destination never read'

// edit profile functionality
app.post("/profile-edit", checkLoggedIn, upload.single("avatar"), async (request, response) => {
    console.log(request.body, request.file, request.session.userid);
    let filename = null;
     if (request.file && request.file.filename) {
    // checks file exists and has a file name
    filename = "uploads/" + request.file.filename;
  }
});

//Add email verification with sendgrid etc! - DON'T DO THIS

// res.render allows the loading of a ejs view file
// This seems redundant as later code does stuff that appears the same?

// application page
// app.get("/", function (req, res) {
//   res.render("pages/application");
// });

// login page
// app.get("/", function (req, res) {
//   res.render("pages/login");
// });

// logout page
// app.get("/", function (req, res) {
//   res.render("pages/logout");
// });

// profile page
// app.get("/", function (req, res) {
//   res.render("pages/profile");
// });

// register page
// app.get("/", function (req, res) {
//   res.render("pages/register");
// });

// viewpost page
// app.get("/", function (req, res) {
//   res.render("pages/viewpost");
// });

// app.get('/login')
//   res.render("login.ejs");

app.use(
  sessions({
    secret: "a secret that only i know",
    // Replace with .env - What exactly is this used for here? Currently ENV only stores the key needed for compass etc, what does the session need to store that is anonymous?
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
}

app.set("view engine", "ejs");

function checkLoggedInState(request) {
  return request.session && request.session.userid;
}

// application EJS page view
app.get("/application", checkLoggedIn, async (request, response) => {
  // response.redirect('./application.html')
  response.render("pages/application", {
    username: request.session.userid,
    // ADD this to relevent pages so that username is displayed!
    isLoggedIn: checkLoggedInState(request),
    postData: await postData.getPosts(5),
  });
});

// viewpost EJS page view
app.get("/viewpost", checkLoggedIn, async (request, response) => {
  // response.redirect('./application.html')
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

// post liking functionality (paired with the likePost function found in 'posts-data.js')
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


// add comment functionality
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

// app.post("/logout", (request, response) => {
//   users.setLoggedIn(request.session.userid, false);
//   request.session.destroy();
//   console.log(users.getUsers());
//   response.redirect("./loggedout.html");
// });

// new user register functionality
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
    // Why use console.log in some places, 'catch' in 'posts-data.js' and response.json in others
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
          response.redirect("/loginfailed.html");
          // Replace html page ^
          // Maybe redirect user to login page but also trigger a popover / callout letting the user know the login failed
        }
      }
    );
  } else {
    console.log("no such user");
    response.redirect("/loginfailed.html");
    // Replace html page ^
    // Maybe redirect user to login page but also trigger a popover / callout letting the user know the login failed
  }
});
app.post("/post", (request, response) => {
  console.log(request.body);
});
// Was this for testing? ^

// app.post("/newpost", (request, response) => {
//   console.log(request.body);
//   postData.addNewPost(request.session.userid, request.body.message);
//   response.redirect("./application.html");
// });

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
// NOTE - CURRENTLY USER CAN REFRESH NEWPOST URL TO SPAM POST, ALSO REMOVE IMAGE POSTS 
// Text no longer appearing after having removed images as a part of posts

// post/timeline display functionality
app.get("/getposts", async (request, response) => {
  response.json({ posts: await postData.getPosts(5) });
});
// add ability to go to another page with further posts and curate the main timeline more to whoever is being followed by the logged in user

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

// require('dotenv').config()
// console.log(process.env.SECRET_FILE)

//NOTABLE ISSUE - you can still post when logged out
//NOTABLE ISSUE - post time and likes aren't included in posts printed to app
//Check if these issues are still present ^

//8ff97b1aa81488ca6d4cfa588d4fcf4fdcc15eb6
