let post = {
  user: userID, //number
  timeposted: Date.now(), //date
  prompt: promptText, //text
  likes: 0, //count
  replies: [
    {
      reply: message, //text
      replyBy: userID, //number or login name
      date: Date.now(), //date
      likes: 0, //counter
    },
  ],
};

const user = {
  username: "user1",
  password: "123",
  loggedin: true,
  postCount: 20,
  activePrompt: Userprompt,
};

const oneDay = 1000 * 60 * 60 * 24;
const oneWeek = 1000 * 60 * 60 * 24 * 7;

const currentTime = Date.now();

// Outline of a potential prompt Schema 
let Userprompt = {
  user: userID, //number
  timeposted: Date.now(), //date
  post, // is this reffering to associated posts? If so wouldn't it be easier to include in the post data 
  expiresIn: oneDay,
};

let usedPrompts = [];

// let verbs = ["fighting", ""];

// const promptSelectArray = [
//   promptSelectOne() { let promptOne = randomDescriptor.concat(" ", randomNoun) },
//   promptSelectTwo()  {},
//   promptSelectThree() {}
// ];

// and then make it always run the code to check the usedPrompts and add new successful prompts to it

// CODE - MAKE A FUNCTION THAT CHECKS TIME STAMP OF CURRENT PROMPT, UPDATES IT AFTER 24 HOURS VIA 

let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
let randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];

let promptOne = randomDescriptor + " " + randomNoun;
let promptTwo = randomNoun + " " + randomNoun + " " + fusion;
// test to see if this just will print two of the same nouns

//array.rpototype.find() - array.find looking through usedPrompts, if match is found, returns True - we want it to return 'undefined'

// Would a string literal be the way to print 'userName userPrompt userMessage' for posts

let todaysPrompt = "";
// maybe title this userPrompt? Sometimes all users get the same prompt, sometimes users get different individualised ones

//Maybe delete uploads folder? doesn't seem necessary if images are just for pfps but maybe I am wrong

// Displays users as either - [Username] The [Prompt] OR [Username] subheading: [Prompt]