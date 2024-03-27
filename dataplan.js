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

let verbs = ["pretending to be", ""];
