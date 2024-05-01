const express = require("express");
const utils = require("./utils.js");

const app = express();
app.listen(3005, () => console.log("Listening on port 3005"));

app.use(express.static("./public"));

app.use(express.urlencoded({ extended: false }));

app.post("/login", (request, response) => {
  console.log(request.body);
  response.redirect("loggedin.html");
});

app.post("/post", (request, response) => {
  console.log(request.body);
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
