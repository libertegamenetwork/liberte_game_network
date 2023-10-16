export const gameData = {
  gameId: "1234",
  title: "Test Game",
  creator: "REX TECH",
  description:
    "The best test game that was ever created to test liberte and all game networks world wide. It is truly increadible and amazing",
  tags: ["MMO", "ADVENTURE", "ACTION"],
  socials: {
    website: "",
    twitter: "",
    discord: "",
  },
  modules: ["123456", "78910"],
};

export const ownedGames = [
  {
    gameId: "1234",
    gameModules: ["123456"],
  },
];

export const gameModules = [
  {
    moduleId: "123456",
    gameId: "1234",
    name: "Pong Module #1",
    creator: "REX TECH",
    description:
      "The best test module that was ever created to test liberte and all modules world wide. It is truly increadible and amazing",
    entryReqs: ["MMO", "ADVENTURE", "ACTION"],
    links: {},
  },
  {
    moduleId: "78910",
    gameId: "1234",
    name: "Pong Module #2",
    creator: "REX TECH",
    description:
      "The best test module that was ever created to test liberte and all modules world wide. It is truly increadible and amazing",
    entryReqs: ["MMO", "ADVENTURE", "ACTION"],
    links: {},
  },
];
