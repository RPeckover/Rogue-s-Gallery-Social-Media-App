const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const userSchema = new Schema({
  username: String,
  password: String,
  loggedin: Boolean,
  //bio: String,
  avatar: {type: String, default: "/images/defaultPFP.png"}, // check this
  currentPrompt: [
    {  
      promptText: String,
      creationTime: {type: Date},
      currentTime: {type: Date, default: Date.now}
    }
  ],
  usedPrompts: [] // will store prompts to ensure identical prompts aren't served to the same user twice
});

//import bcrypt
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

userSchema.pre("save", function (next) {
  let user = this;
//Why do we make user = 'this'?  - copied from bcrypt

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using the new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

const User = model("MyDemoUser", userSchema);

async function newUser(username, password) {
  const user = { username: username, password: password, loggedin: false, avatar: "/images/defaultPFP.png"}; // check if this or default in schema itself is correct for a default PFP
  // bio: bio, (Add this above if going ahead with including bios in profiles)
  await User.create(user).catch((err) => {
    console.log("Error:" + err);
  });
}

async function getUsers() {
  let users = [];
  await User.find({})
    .exec()
    .then((dataFromMongo) => {
      users = dataFromMongo;
    })
    .catch((err) => {
      console.log("Error:" + err);
    });
  return users;
}

async function findUser(userToFind) {
  let foundUser = null;
  await User.findOne({ username: userToFind })
    .exec()
    .then((mongoData) => {
      foundUser = mongoData;
    })
    .catch((err) => {
      console.log("Error:" + err);
    });
  return foundUser;
}

//bcrypt version, passing in an action function
async function checkPassword(username, password, action) {
  let user = await findUser(username);
  if (user) {
    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        action(isMatch);
      })
      .catch((err) => {
        throw err;
      });
  }
  return false;
}

exports.newUser = newUser;
exports.getUsers = getUsers;
exports.findUser = findUser;
exports.checkPassword = checkPassword;
