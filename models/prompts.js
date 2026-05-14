// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;
// const promptSchema = new Schema({
//   promptText: String,
//   creationTime: {type: Date},
//   currentTime: {type: Date, default: Date.now},
// });

const { getUsers } = require("./users");

// const Prompt = model("MyDemoPrompt", promptSchema);

// ^ All of the above commented out as PROMPT IS PARTT OF USER SCHEMA CURRENTLY

// INTENDED FUNCTIONALITY OF THE BELOW FUNCTION
// Every 24 hours add current prompt ('promptText' in user schema) to 'usedPrompts' array (also in user schema), randomise a number, 
// pass it to a switch statement which selects one of a range of methods of concatenating nouns and descriptors to create a new prompt. 
// If this new prompt is the same as any in the user's 'usedPrompt' array, rerun the function.

// function constructing a new prompt for each user every 24 hours
async function newPrompt() {

// prompts served to all users once a week
    let communalPrompts = [
        "Pirate Captain Desperately trying to impress his crew",
        "Robot increasingly anxious about a mysterious bolt that fell off of their body",
        "Door to door ice salesman in the Sahara desert",
        "The chosen one of legend, convinced all others are fakes",
        "Villain giving their evil speech moments before being thwarted",
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
        "Mysterious wanderer trying to out-mystery everyone",
        "Person who doesn't realise they're clearly haunted",
        "Courtroom witness who is fuzzy on ALL details",
        "Widow who definitely killed her husband",
        "Inventor who keeps accidenttally recreating commonly available devices",
        "Best man delivering an increasingly concerning wedding speech",
        "Person at the watercooler trying to outdo everyone with how cool their weekend was",
        "Lottery winner trying to keep it on the downlow",
        "Person who's having an intense trip",
        "Spam bots",
        "Debater 'playing devils advocate' but clearly on the side of the devil",
        "Cult recruiters trying to out-recruit all others",
        "Self-Proclaimed Empath",
        "Celebrity issuing a vague apology clearly written by a PR team",
        "Person with poor reading comprehension"
    ];

// adjectives and otther descriptors used to modify nouns / concepts, used in prompt creation
    let descriptors = [
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
        "Cantankerous",
        "Forgetful",
        "Gout-Addled",
        "Sinister",
        "Riddlesome",
        "Enigmatic",
        "Sullen",
        "Reserved",
        "Time-Travelling",
        "Tragic",
        "Lucky",
        "Snooty",
        "Uncompromising",
        "Unsettling",
        "Polite",
        "Agreeable",
        "Classy",
        "Rambunctious",
        "Scatterbrained",
        "Grounded",
        "Skeptical",
        "Cynical",
        "Prideful",
        "Easily-Persuaded",
        "Self-Contradicting",
        "Barely-Conscious",
        "Rapidly Approaching",
        "Green",
        "Magical",
        "Pedantic",
        "Fraudulent",
        "So-Called",
        "Alleged",
        "Self-Proclaimed",
        "Unethical",
        "Principled",
        "Humble",
        "Cheerful",
        "Optimistic",
        "Burnt-Out",
        "Dramatic",
        "Hysterical",
        "Thin-Skinned",
        "Worried",
        "Vain",
        "Boastful",
        "Conniving",
        "Patronising",
        "Aloof",
        "Apathetic",
        "Timid",
        "Immature",
        "Knowledgable",
        "Insincere",
        "Morbid",
        "Jealous",
        "Petty",
        "Peaceful",
        "Aspiring",
        "Inexperienced",
        "Cultured",
        "Dignified",
        "Capable",
        "Debonair",
        "Elegant",
        "Passionate",
        "Popular",
        "Unpopular",
        "Famous",
        "Infamous",
        "Relaxed",
        "Chill",
        "Respectful",
        "Sentimental",
        "Buisnesslike",
        "Competitive",
        "Experimental",
        "Escaped",
        "Preachy",
        "Subversive",
        "Retired",
        "Dishonourably Discharged",
        "Solemn",
        "Sarcastic",
        "Performative",
        "Criminal",
        "Gullible",
        "Indecisive",
        "Naive",
        "Contrarian",
        "Opinionated",
        "Well-Meaning",
        "Disgraced",
        "Small-Time",
        "Big-Shot",
        "Renowned",
        "Honourable"
    ];

// nouns and concepts used for prompt creation
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
        "Rockstar",
        "Rival",
        "Scholar",
        "Poliician",
        "Cultist"
    ];

// Psuedocode - check 'creationTime' and if its 24 hours past 'currentTime', add prompt to used prompts, generate a new prompt by randomising a number to select one of a range of methods of concatenating nouns and descriptors

userid.usedPrompts.push(promptText);
// stores expired prompts in the user data object

randomisePromptMethod();

function randomisePromptMethod(min, max) {
    min = Math.ceil(1);
    max = Math.floor(3); 
    methodNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return methodNum;
}
switch (methodNum) {
    //prompt method 1 
    case 1:
        let randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
        let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        //let currentPrompt = randomDescriptor + " " + randomNoun;
        // set creation time

    //prompt method 2 
    case 2:
        let randomNoun1 = nouns[Math.floor(Math.random() * nouns.length)];
        let randomNoun2 = nouns[Math.floor(Math.random() * nouns.length)];
        //let currentPrompt = randomNoun1 + " / " + randomNoun2 + " " + fusion;
        // set creation time

    case 3:
        let randomDescriptor1 = descriptors[Math.floor(Math.random() * descriptors.length)];
        let randomDescriptor2 = descriptors[Math.floor(Math.random() * descriptors.length)];
        let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        //let currentPrompt = randomDescriptor1 + " " + randomDescriptor2 + " " + randomNoun;
        // set creation time
}

getUsers();
// where do I put this

// psuedocode - return randomised result from switch statment and set its value eaqual to 'promptText' in 'userSchema' found on 'users.js'
// also set creation time using date.now and make that value equal to 'creationTime' in 'userSchema' 

if (usedPrompts.includes(promptText)) {
    newPrompt();
}
// ^ reruns function if prompt has already been given to user previously 

};
// IMPORTANT - CURRENTLY THERE CAN BE DESCREPANCIES FROM USER TO USER IN THEIR PROMPT CRERATION TIME, IF WEEKLY UNIVERSAL PROMPTS ARE TO BE IMPLIMENTED, ALL PROMPTS SHOULD REFRESH AT THE SAME TIME
