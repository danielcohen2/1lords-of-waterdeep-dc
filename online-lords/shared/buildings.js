// const Resources = require("./resources");
// const {resource} = require("./logic"); //this isn't working
function resource(orange, black, purple, white, gold, choice) {
  return {orange, black, purple, white, gold, choice};
}

module.exports.buildings = [
  {
    name: "HOUSE OF GOOD SPIRITS",
    cost: 3,
    ownerID: "",
    spotReward: {
      resources: resource(1, 0, 0, 0, 0, 1),
    },
    ownerReward: {
      resources: resource(1, 0, 0, 0, 0),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "HOUSE OF THE MOON",
    cost: 3,
    ownerID: "",
    spotReward: {
      resources: resource(0, 0, 0, 1, 0),
      text: "and take 1 face-up",
      quests: 1,
    },
    ownerReward: {
      resources: resource(0, 0, 0, 0, 2),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "NORTHGATE",
    cost: 3,
    ownerID: "",
    spotReward: {
      resources: resource(0, 0, 0, 0, 2, 1),
    },
    ownerReward: {
      points: 2,
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "DRAGON TOWER",
    cost: 3,
    ownerID: "",
    spotReward: {
      resources: resource(0, 0, 1, 0, 0),
      intrigues: 1,
    },
    ownerReward: {
      intrigues: 1,
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "HELMSTAR WAREHOUSE",
    cost: 3,
    ownerID: "",
    spotReward: {
      resources: resource(0, 2, 0, 0, 2),
    },
    ownerReward: {
      resources: resource(0, 1, 0, 0, 0),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE PALACE OF WATERDEEP",
    cost: 4,
    ownerID: "",
    spotReward: {
      special: {type: "own_ambassador"},
      text:
        "Take the Ambassador. At the start of the next round, you assign the Ambassador before any other player's turn.",
    },
    ownerReward: {
      points: 2,
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE THREE PEARLS",
    cost: 4,
    ownerID: "",
    spotRequires: {
      resources: resource(0, 0, 0, 0, 0, 2), //requires returning 2 cubes of choosing
    },
    spotReward: {
      resources: resource(0, 0, 0, 0, 0, 3), //3 cubes of choosing
    },
    ownerReward: {
      resources: resource(0, 0, 0, 0, 2),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "SMUGGLER'S DOCK",
    cost: 4,
    ownerID: "",
    spotRequires: {
      resources: resource(0, 0, 0, 0, 2),
    },
    spotReward: {
      //choice of 4 orange/black
      resourceChoice: [
        resource(1, 1, 0, 0, 0),
        resource(1, 1, 0, 0, 0),
        resource(1, 1, 0, 0, 0),
        resource(1, 1, 0, 0, 0),
      ],
    },
    ownerReward: {
      resources: resource(0, 0, 0, 0, 2),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "HEROES' GARDEN",
    cost: 4,
    ownerID: "",
    spotReward: {
      special: {
        type: "get_quest_immediately_complete",
      },
      text:
        "Take 1 face-up Quest. You may immediately complete that Quest. If you do, score 4 points",
    },
    ownerReward: {
      points: 2,
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "HOUSE OF WONDER",
    cost: 4,
    ownerID: "",
    spotRequires: {
      resources: resource(0, 0, 0, 0, 2),
    },
    spotReward: {
      resourceChoice: [resource(0, 0, 1, 1, 0), resource(0, 0, 1, 1, 0)], //choice of 2 white/purple
    },
    ownerReward: {
      resources: resource(0, 0, 0, 0, 2),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE STONE HOUSE",
    cost: 4,
    ownerID: "",
    spotReward: {
      text: "Gain Gold for each Building tile in play.",
      resources: {},
      special: {
        type: "gold_for_each_building_in_play",
      },
    },
    ownerReward: {
      resources: resource(0, 0, 0, 0, 2),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE YAWNING PORTAL",
    cost: 4,
    ownerID: "",
    spotReward: {
      resources: resource(0, 0, 0, 0, 0, 2),
    },
    ownerReward: {
      resources: resource(0, 0, 0, 0, 0, 1),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE SKULKWAY",
    cost: 4,
    ownerID: "",
    spotReward: {
      resources: resource(1, 1, 0, 0, 2),
    },
    ownerReward: {
      resourceChoice: [resource(1, 1, 0, 0, 0)], //orange or black
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE WAYMOOT",
    cost: 4,
    ownerID: "",
    spotReward: {
      points: 0,
      special: {
        type: "when_purchased_and_start_of_round",
        objectToAdd: {points: 3},
      },
      text:
        "WHEN PURCHASED/START OF ROUND - Place 3 Points on this space. Take and score all Points from this space.",
    },
    ownerReward: {
      points: 2,
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE GOLDEN HORN",
    cost: 4,
    ownerID: "",
    spotReward: {
      resources: {},
      special: {
        type: "when_purchased_and_start_of_round",
        objectToAdd: {resources: resource(0, 0, 0, 0, 4)},
      },
      text:
        "WHEN PURCHASED/START OF ROUND - Place 4 Gold on this space. Take all Gold from this space.",
    },
    ownerReward: {
      resources: resource(0, 0, 0, 0, 2),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE JESTERS' COURT",
    cost: 4,
    ownerID: "",
    spotReward: {
      resources: {},
      special: {
        type: "when_purchased_and_start_of_round",
        objectToAdd: {resources: resource(0, 2, 0, 0, 0)},
      },
      text:
        "WHEN PURCHASED/START OF ROUND - Place 2 Black on this space. Take all Black from this space.",
    },
    ownerReward: {
      resources: resource(0, 1, 0, 0, 0),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "CARAVAN COURT",
    cost: 4,
    ownerID: "",
    spotReward: {
      resources: {},
      special: {
        type: "when_purchased_and_start_of_round",
        objectToAdd: {resources: resource(2, 0, 0, 0, 0)},
      },
      text:
        "WHEN PURCHASED/START OF ROUND - Place 2 Orange on this space. Take all Orange from this space.",
    },
    ownerReward: {
      resources: resource(1, 0, 0, 0, 0),
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "TOWER OF THE ORDER",
    cost: 4,
    ownerID: "",
    spotReward: {
      resources: {},
      special: {
        type: "when_purchased_and_start_of_round",
        objectToAdd: {resources: resource(0, 0, 1, 0, 0)},
      },
      text:
        "WHEN PURCHASED/START OF ROUND - Place 1 Purple on this space. Take all Purple from this space.",
    },
    ownerReward: {
      intrigues: 1,
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "SPIRES OF THE MORNING",
    cost: 4,
    ownerID: "",
    spotReward: {
      resources: {},
      special: {
        type: "when_purchased_and_start_of_round",
        objectToAdd: {resources: resource(0, 0, 0, 1, 0)},
      },
      text:
        "WHEN PURCHASED/START OF ROUND - Place 1 White on this space. Take all White from this space.",
    },
    ownerReward: {
      points: 2,
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "NEW OLAMN",
    cost: 8,
    ownerID: "",
    spotReward: {
      resources: resource(0, 2, 1, 0, 0),
    },
    ownerReward: {
      resourceChoice: [resource(0, 1, 1, 0, 0)], //black or purple
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "HOUSE OF HEROES",
    cost: 8,
    ownerID: "",
    spotReward: {
      resources: resource(2, 0, 0, 1, 0),
    },
    ownerReward: {
      resourceChoice: [resource(1, 0, 0, 1, 0)], //white or orange
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "FETLOCK COURT",
    cost: 8,
    ownerID: "",
    spotReward: {
      resources: resource(2, 0, 1, 0, 0),
    },
    ownerReward: {
      resourceChoice: [resource(1, 0, 1, 0, 0)], //orange or purple
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE TOWER OF LUCK",
    cost: 8,
    ownerID: "",
    spotReward: {
      resources: resource(0, 2, 0, 1, 0),
    },
    ownerReward: {
      resourceChoice: [resource(0, 1, 0, 1, 0)], //white or black
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
  {
    name: "THE ZOARSTAR",
    cost: 8,
    ownerID: "",
    spotReward: {
      special: {
        type: "use_zoarstar",
      },
      text:
        "Choose a space containing an opponent's Piece. You use that space's action as though you had assigned a Piece to it.",
    },
    ownerReward: {
      points: 2,
    },
    inPlay: false,
    peopleOnSpot: [],
    gems: 0,
  },
];
