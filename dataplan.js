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

let handWrittenPrompts = [];

let prompt = {
  user: userID, //number
  timeposted: Date.now(), //date
  post,
};

let usedPrompts = {};

let nouns = [
  "Wizard",
  "Witch",
  "Knight",
  "Cowboy",
  "Alien",
  "Robot",
  "Explorer",
  "Deep Sea Diver",
  "Karate Master",
  "Monster Hunter",
  "Spacefarer",
  "Dastardly Villain",
  "Noble Hero",
  "Edgy Antihero",
  "Pretentious Artist",
];

let adjectives = [
  "Unlucky",
  "Fearsome",
  "Anxious",
  "Foolish",
  "Wise",
  "Brash",
  "Overconfident",
  "Suspicious",
];

// let verbs = ["fighting", ""];

// const promptSelectArray = [
//   promptSelectOne() { let promptOne = randomAdjective.concat(" ", randomNoun) },
//   promptSelectTwo()  {},
//   promptSelectThree() {}
// ];

//Would a switch statment be better as I could randomise which case (function) is used
// and then make it always run the code to check the usedPrompts and add new successful prompts to it

let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
let randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

let promptOne = randomAdjective.concat(" ", randomNoun);
let promptTwo = randomNoun.concat(" ", randomNoun, " fusion");
// test to see if this just will print two of the same nouns

//maybe try functions called using a number in an object?

//array.rpototype.find() - array.find looking through usedPrompts, if match is found, returns True - we want it to return 'undefined'

// Would a string literal be the way to print 'userName userPrompt userMessage' for posts

let todaysPrompt = "";
// maybe title this userPrompt? Sometimes all users get the same prompt, sometimes users get different individualised ones
