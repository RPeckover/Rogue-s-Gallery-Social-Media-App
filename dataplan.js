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

let Userprompt = {
  user: userID, //number
  timeposted: Date.now(), //date
  post,
  expiresIn: oneDay,
};

let usedPrompts = {};

let handWrittenPrompts = [
  "Pirate Captain Desperately trying to impress his crew",
  "Robot increasingly anxious about mysterious bolt that fell off of their body",
  "Door to door ice salesman in the Sahara desert",
  "Hero [blank], Savior of The Realm",
  "Dastardly Derek, villain of despair",
  "Lost dad who is sure he can find his way home without directions",
  "A sad but slightly threatening Clown",
  "Dragon that lost their horde in a stock market crash",
  "Person who got bit in a zombie apocalypse but didn't tell anyone for some reason",
  "Vampire trying really hard to blend in",
  "Detective trying to figure out [Something obvious]",
  "Guy who is way too into devil sticks",
  "Person incorrectly quoting [Insert figure]",
  "Person explaining how they definitely aren't having midlife crisis",
  "Beekeeper who hasn't realised their hive is definitley not bees",
  "Reddit Moderator",
  "Crypto Bro trying to rug pull",
  "Evil advisor to the sickly king",
  "Mysterious wanderer trying to out-mystery everyone"
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
  "Dastardly",
  "Noble",
  "Edgy",
  "Pretentious",
  "Insecure",
  "Mischevious",
  "Cowardly",
  "Smug",
  "Untrustworthy",
  "Loud",
  "Tiny",
  "Huge",
  "Sneaky",
  "Sleepy",
  "Frenzied",
  "Furious",
  "Thoughtful",
  "Unprofessional",
  "Incompetant",
  "Smooth-Talking",
  "Downtrodden",
  "Shy",
  "Posessed",
  "Oblivious",
  "Zombified",
  "Rowdy",
  "Devious",
  "Unhinged",
  "Normal",
  "Regular",
  "Evil",
  "Shadow",
  "Reverse",
  "Friendly",
  "Flamboyant",
  "Old-Timey",
  "Petulant",
  "Dyslexic",
  "Helpful",
  "Clumsy",
  "Glamorous",
  "Conspiratorial",
  "Fickle",
  "Depressed",
  "Dubious",
  "Verbose",
  "Incoherant",
  "Rhyming",
  "Self-Serious",
  "Morose",
  "Post-Apocalyptic",
  "Cantankerous"
];

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
  "Villain",
  "Hero",
  "Antihero",
  "Artist",
  "Burglar",
  "Pirate",
  "Clown",
  "Mime",
  "Miner",
  "Cave-Diver",
  "Ghost Hunter",
  "Astronaut",
  "Gamer",
  "Tourist",
  "Gladiator",
  "Chef",
  "Vampire",
  "Cheerleader",
  "Caveman",
  "Zombie",
  "Wrestler",
  "Street Magician",
  "Doctor",
  "Ninja",
  "Forest Elf",
  "Fisherman",
  "Scientist",
  "Werewolf",
  "Monster",
  "Cryptid",
  "Lumberjack",
  "Detective",
  "Mobster",
  "Academic",
  "CEO",
  "Engineer",
  "Genie",
  "Hippie",
  "Mermaid",
  "Stunt Actor",
  "Knight",
  "Investor",
  "Middle Manger",
  "DJ",
  "Merchant",
  "Soothsayer",
  "Emperor",
  "Nerd",
  "Skydiver",
  "Pensioner",
  "Influencer",
  "Biker",
  "Wife Guy",
  "Bigfoot",
  "Jazz Musician",
  "Mountaineer",
  "Prospector",
  "Jester",
  "King",
  "Queen",
  "Prince",
  "Princess",
  "Noble",
  "Delivery Driver",
  "Racer",
  "Bandit",
  "Diva",
  "Weeaboo",
  "Ghoul",
  "Ghost",
  "Buisnessman",
  "Farmer",
  "Cyborg",
  "Photographer",
  "Papperazi",
  "Journalist",
  "Liar",
  "Spy",
  "Acrobat",
  "Bounty Hunter",
  "Martial Artist",
  "Castaway",
  "Survivalist",
  "Bard",
  "Aristocrat",
  "Newspaper Kid",
  "Chimney Sweep",
  "Orphan",
  "Bodybuilder",
  "Barbarian",
  "Bogeyman",
  "Conspiracy Theorist",
  "Inventor",
  "Surfer",
  "Dentist",
  "Hitman",
  "Bodyguard",
  "Psychologist",
  "Monk",
  "Shopkeeper",
  "Guard",
  "Poet",
  "Head Teacher",
  "Escapologist",
  "Archeologist",
  "Astronomer",
  "Paleontologist",
  "Superhero",
  "Supervillain",
  "Rockstar"
];

// let verbs = ["fighting", ""];

// const promptSelectArray = [
//   promptSelectOne() { let promptOne = randomAdjective.concat(" ", randomNoun) },
//   promptSelectTwo()  {},
//   promptSelectThree() {}
// ];

// and then make it always run the code to check the usedPrompts and add new successful prompts to it

let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
let randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

let promptOne = randomAdjective + " " + randomNoun;
let promptTwo = randomNoun + " " + randomNoun + " " + fusion;
// test to see if this just will print two of the same nouns

//array.rpototype.find() - array.find looking through usedPrompts, if match is found, returns True - we want it to return 'undefined'

// Would a string literal be the way to print 'userName userPrompt userMessage' for posts

let todaysPrompt = "";
// maybe title this userPrompt? Sometimes all users get the same prompt, sometimes users get different individualised ones


//Maybe delete uploads folder? doesn't seem necessary if images are just for pfps but maybe I am wrong