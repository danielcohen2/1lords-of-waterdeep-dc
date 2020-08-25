// const Resources = require("./resources");
// const {resource} = require("./logic");
function resource(orange, black, purple, white, gold, choice) {
  return {orange, black, purple, white, gold, choice};
}

module.exports.spots = [
  {
    // name: "CLIFFWATCH INN 1",
    group: "CLIFFWATCH INN",
    shortName: "Quest and 2 Gold",
    spotReward: {
      quests: 1,
      resources: resource(0, 0, 0, 0, 2),
    },
    peopleOnSpot: [],
  },
  {
    // name: "CLIFFWATCH INN 2",
    group: "CLIFFWATCH INN",
    shortName: "Quest and Intrigue",
    spotReward: {
      quests: 1,
      intrigues: 1,
    },
    peopleOnSpot: [],
  },
  {
    // name: "CLIFFWATCH INN 3",
    group: "CLIFFWATCH INN",
    shortName: "Reset Quests and then pick a Quest",
    spotReward: {
      text: "Reset Quests then ",
      resetQuests: true,
      quests: 1,
      //reset quests
    },
    peopleOnSpot: [],
  },

  {
    name: "FIELD OF TRIUMPH",
    group: "resourceSpot",
    shortName: "2 Orange Cubes",
    spotReward: {
      resources: resource(2, 0, 0, 0, 0, 0),
    },
    peopleOnSpot: [],
  },
  {
    name: "THE GRINNING LION TAVERN",
    group: "resourceSpot",
    shortName: "2 Black Cubes",
    spotReward: {
      resources: resource(0, 2, 0, 0, 0),
    },
    peopleOnSpot: [],
  },
  {
    name: "BLACKSTAFF TOWER",
    group: "resourceSpot",
    shortName: "1 Purple Cube",
    spotReward: {
      resources: resource(0, 0, 1, 0, 0),
    },
    peopleOnSpot: [],
  },
  {
    name: "THE PLINTH",
    group: "resourceSpot",
    shortName: "1 White Cube",
    spotReward: {
      resources: resource(0, 0, 0, 1, 0),
    },
    peopleOnSpot: [],
  },
  {
    name: "AURORA'S REALMS SHOP",
    group: "resourceSpot",
    shortName: "4 Gold",
    spotReward: {
      resources: resource(0, 0, 0, 0, 4),
    },
    peopleOnSpot: [],
  },

  {
    name: "CASTLE WATERDEEP",
    group: "castleSpot",
    shortName: "Castle and Intrigue",
    spotReward: {
      castle: true,
      intrigues: 1,
    },
    peopleOnSpot: [],
  },
  {
    name: "BUILDER'S HALL",
    group: "buildersHallSpot",
    shortName: "Buy a Building",
    spotReward: {
      buyBuilding: true,
      text: "Choose 1 Building, pay its cost, and put it into play.",
    },
    peopleOnSpot: [],
  },

  {
    number: 1,
    group: "WATERDEEP HARBOR",
    shortName: "Waterdeep Harbor 1",
    spotReward: {
      text: "Play ",
      playIntrigue: 1,
    },
    peopleOnSpot: [],
  },
  {
    number: 2,
    group: "WATERDEEP HARBOR",
    shortName: "Waterdeep Harbor 2",
    peopleOnSpot: [],
    spotReward: {
      text: "Play ",
      playIntrigue: 1,
    },
  },
  {
    number: 3,
    group: "WATERDEEP HARBOR",
    shortName: "Waterdeep Harbor 3",
    peopleOnSpot: [],
    spotReward: {
      text: "Play ",
      playIntrigue: 1,
    },
  },
];
