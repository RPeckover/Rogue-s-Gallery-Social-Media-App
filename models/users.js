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
  usedPrompts: [] 
  // will store prompts to ensure identical prompts aren't served to the same user twice
});

const bcrypt = require("bcrypt");
// imports bcrypt
const SALT_WORK_FACTOR = 10;
// 

userSchema.pre("save", function (next) {
  let user = this;
//Why do we make user = 'this'?  - copied from bcrypt

  if (!user.isModified("password")) return next();
  // only hash the password if it has been modified (or is new)

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
  // generates a salt
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      // hashes the password using the new salt
      if (err) return next(err);

      user.password = hash;
      // overrides the cleartext password with the hashed one
      next();
    });
  });
});

const User = model('myDemoUser', userSchema);

async function newUser(username, password) {
  const user = { username: username, password: password, loggedin: false, avatar: myPFP}; // check if this or default in schema itself is correct for a default PFP
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

async function checkPassword(username, password, action) {
// checks password matches via bcrypt by passing in an action function
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