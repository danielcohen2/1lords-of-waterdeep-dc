// const Resources = require("./resources");
// const {resource} = require("./logic");

function resource(orange, black, purple, white, gold, choice) {
  return {orange, black, purple, white, gold, choice};
}

module.exports.quests = [
  {
    type: "ARCANA",
    name: "RECOVER THE MAGISTER'S ORB",
    requires: {resources: resource(0, 3, 2, 0, 0)},
    reward: {
      points: 6,
      special: {
        type: "recover_magisters_orb",
      },
      text:
        "Once per round, you can assign a Person to a space containing an opponent's Person.",
    },
  },
  {
    type: "ARCANA",
    name: "EXPLORE AHGHAIRON'S TOWER",
    requires: {resources: resource(1, 0, 2, 0, 2)},
    reward: {
      points: 6,
      special: {
        type: "on_receiving_purple_get_intrigue",
      },
      text:
        "Whenever you take an action that provides any Purple Cubes, also draw an Intrigue.",
    },
  },
  {
    type: "ARCANA",
    name: "HOST FESTIVAL FOR SUNE",
    requires: {resources: resource(2, 0, 2, 0, 4)},
    reward: {
      points: 9,
      resources: resource(0, 0, 0, 2, 0),
    },
  },
  {
    type: "ARCANA",
    name: "RETRIEVE ANCIENT ARTIFACTS",
    requires: {resources: resource(2, 1, 2, 0, 0)},
    reward: {
      points: 11,
      resources: resource(0, 0, 0, 0, 4),
    },
  },
  {
    type: "ARCANA",
    name: "DOMESTICATE OWLBEARS",
    requires: {resources: resource(0, 0, 2, 1, 0)},
    reward: {
      points: 8,
      resources: resource(1, 0, 0, 0, 2),
    },
  },
  {
    type: "ARCANA",
    name: "RESEARCH CHRONOMANCY",
    requires: {resources: resource(0, 0, 2, 0, 4)},
    reward: {
      points: 4,
      resources: resource(0, 0, 1, 0, 0),
      special: {
        type: "return_1_to_pool",
      },
      text: "and return 1 of your assigned Persons to your pool.",
    },
  },
  {
    type: "ARCANA",
    name: "INFILTRATE HALASTER'S CIRCLE",
    requires: {resources: resource(0, 0, 5, 0, 2)},
    reward: {
      points: 25,
    },
  },
  {
    type: "ARCANA",
    name: "STUDY THE ILLUSK ARCH",
    requires: {resources: resource(0, 0, 2, 1, 0)},
    reward: {
      points: 8,
      special: {
        questBonusType: "ARCANA",
        questBonusPoints: 2,
      },
      text: "Whenever you complete an Arcana Quest, you score 2 Points.",
    },
  },
  {
    type: "ARCANA",
    name: "INVESTIGATE ABERRANT INFESTATION",
    requires: {resources: resource(1, 0, 2, 1, 0)},
    reward: {
      points: 13,
      intrigues: 1,
    },
  },
  {
    type: "ARCANA",
    name: "EXPOSE RED WIZARDS' SPIES",
    requires: {resources: resource(1, 2, 2, 1, 2)},
    reward: {
      points: 20,
      intrigues: 1,
    },
  },
  {
    type: "ARCANA",
    name: "STEAL SPELLBOOK FROM SILVERHAND",
    requires: {
      resources: resource(1, 2, 2, 0, 0),
    },
    reward: {
      points: 7,
      resources: resource(0, 0, 0, 0, 4),
      intrigues: 2,
    },
  },
  {
    type: "ARCANA",
    name: "RECRUIT FOR BLACKSTAFF ACADEMY",
    requires: {resources: resource(1, 1, 2, 0, 4)},
    reward: {
      points: 6,
      resources: resource(0, 0, 3, 0, 0),
    },
  },
  {
    type: "COMMERCE",
    name: "ESTABLISH NEW MERCHANT GUILD",
    requires: {resources: resource(2, 0, 0, 1, 4)},
    reward: {
      points: 8,
      special: {
        questBonusType: "COMMERCE",
        questBonusPoints: 2,
      },
      text: "Whenever you complete a Commerce Quest, you score 2 Points.",
    },
  },
  {
    type: "COMMERCE",
    name: "LURE ARTISANS OF MIRABAR",
    requires: {resources: resource(1, 1, 0, 1, 2)},
    reward: {
      points: 4,
      special: {type: "get_building_from_BH"},
      text:
        "and put 1 Building from Builder's Hall into play under your control at no cost",
    },
  },
  {
    type: "COMMERCE",
    name: "PLACATE THE WALKING STATUE",
    requires: {resources: resource(0, 2, 0, 2, 4)},
    reward: {
      points: 10,
      special: {type: "get_building_from_stack"},
      text:
        "and draw 1 Building from the stack and put it into play under your control at no cost.",
    },
  },
  {
    type: "COMMERCE",
    name: "SAFEGUARD ELTORCHFUL MAGE",
    requires: {resources: resource(1, 1, 1, 0, 4)},
    reward: {
      points: 4,
      resources: resource(0, 0, 2, 0, 0),
    },
  },
  {
    type: "COMMERCE",
    name: "SPY ON THE HOUSE OF LIGHT",
    requires: {resources: resource(3, 2, 0, 0, 2)},
    reward: {
      points: 6,
      resources: resource(0, 0, 0, 0, 6),
    },
  },
  {
    type: "COMMERCE",
    name: "LOOT THE CRYPT OF CHAUNTEA",
    requires: {resources: resource(0, 3, 0, 1, 2)},
    reward: {
      points: 7,
      intrigues: 1,
      special: {type: "get_quest_from_deck"},
      text: "and draw a Quest from the deck.",
    },
  },
  {
    type: "COMMERCE",
    name: "THIN THE CITY WATCH",
    requires: {resources: resource(1, 1, 0, 1, 4)},
    reward: {
      points: 9,
      resources: resource(0, 4, 0, 0, 0),
    },
  },
  {
    type: "COMMERCE",
    name: "SEND AID TO THE HARPERS",
    requires: {resources: resource(1, 1, 0, 1, 4)},
    reward: {
      points: 15,
      text: "and choose an opponent to gain 4 Gold.",
      special: {
        type: "Give resource to another player",
        resources: resource(0, 0, 0, 0, 4),
      },
    },
  },
  {
    type: "COMMERCE",
    name: "IMPERSONATE ADARBRENT NOBLE",
    requires: {resources: resource(2, 2, 1, 1, 4)},
    reward: {
      points: 18,
      intrigues: 2,
    },
  },
  {
    type: "COMMERCE",
    name: "ALLY WITH HOUSE THANN",
    requires: {resources: resource(0, 3, 1, 1, 8)},
    reward: {
      points: 25,
    },
  },
  {
    type: "COMMERCE",
    name: "INFILTRATE BUILDER'S HALL",
    requires: {resources: resource(2, 2, 0, 0, 4)},
    reward: {
      points: 6,
      special: {
        type: "buy_building_bonus",
        buyBuildingBonusPoints: 4,
      },
      text: "Whenever you buy a Buiding, you score 4 Points",
    },
  },
  {
    type: "COMMERCE",
    name: "BRIBE THE SHIPWRIGHTS",
    requires: {resources: resource(0, 4, 1, 0, 4)},
    reward: {
      points: 10,
      special: {
        type: "on_receiving_gold_get_blackCube",
      },
      text:
        "Whenever you take an action that provides any Gold, also take a Black Cube from the supply and place it in your Tavern. ",
    },
  },
  {
    type: "PIETY",
    name: "PERFORM THE PENANCE OF DUTY",
    requires: {resources: resource(2, 0, 0, 2, 4)},
    reward: {
      points: 12,
      resources: resource(1, 0, 0, 1, 0),
    },
  },
  {
    type: "PIETY",
    name: "ELIMINATE VAMPIRE COVEN",
    requires: {resources: resource(2, 1, 0, 2, 0)},
    reward: {
      points: 11,
      resources: resource(0, 0, 0, 0, 4),
    },
  },
  {
    type: "PIETY",
    name: "HEAL FALLEN GRAY HAND SOLDIERS",
    requires: {resources: resource(0, 0, 1, 2, 4)},
    reward: {
      points: 6,
      resources: resource(6, 0, 0, 0, 0),
    },
  },
  {
    type: "PIETY",
    name: "PRODUCE A MIRACLE FOR THE MASSES",
    requires: {resources: resource(0, 0, 0, 2, 4)},
    reward: {
      points: 5,
      special: {type: "replace_cube_with_white_cube"},
      text:
        "Once per round, whenever you take an action that provides any White Cubes, you can also replace an Orange, Black, or Purple Cube in your Tavern with a White Cube.",
    },
  },
  {
    type: "PIETY",
    name: "PROTECT THE HOUSE OF WONDERS",
    requires: {resources: resource(1, 0, 0, 2, 2)},
    reward: {
      points: 8,
      special: {
        questBonusType: "PIETY",
        questBonusPoints: 2,
      },
      text: "Whenever you complete a Piety Quest, you score 2 Points.",
    },
  },
  {
    type: "PIETY",
    name: "FORM AN ALLIANCE WITH THE RASHEMI",
    requires: {resources: resource(0, 0, 1, 2, 0)},
    reward: {
      points: 10,
      quests: 1,
      text: "and take a Quest from Cliffwatch Inn.",
    },
  },
  {
    type: "PIETY",
    name: "CONVERT A NOBLE TO LATHANDER",
    requires: {resources: resource(1, 0, 0, 2, 0)},
    reward: {
      points: 8,
      quests: 1,
      text: "and take a Quest from Cliffwatch Inn",
    },
  },
  {
    type: "PIETY",
    name: "DISCOVER HIDDEN TEMPLE OF LOLTH",
    requires: {resources: resource(1, 1, 0, 2, 0)},
    reward: {
      points: 10,
      quests: 1,
      text: "and take a Quest from Cliffwatch Inn.",
    },
  },
  {
    type: "PIETY",
    name: "SEAL GATE TO CYRIC'S REALM",
    requires: {resources: resource(0, 3, 0, 2, 4)},
    reward: {
      points: 20,
    },
  },
  {
    type: "PIETY",
    name: "DEFEND THE TOWER OF LUCK",
    requires: {resources: resource(1, 1, 1, 2, 0)},
    reward: {
      points: 0,
      resources: resource(0, 0, 0, 0, 0, 1),
      special: {
        type: "start_round_get_cube_of_choice",
      },
      text:
        "Once at the start of each round, take a Cube of your choice from the supply and place it in your Tavern.",
    },
  },
  {
    type: "PIETY",
    name: "RECRUIT PALADINS FOR TYR",
    requires: {resources: resource(4, 0, 0, 2, 4)},
    reward: {
      points: 10,
      resources: resource(0, 0, 0, 3, 0),
    },
  },
  {
    type: "PIETY",
    name: "CREATE A SHRINE TO OGHMA",
    requires: {resources: resource(0, 0, 0, 5, 2)},
    reward: {
      points: 25,
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "PROCURE STOLEN GOODS",
    requires: {resources: resource(0, 3, 0, 0, 6)},
    reward: {
      points: 8,
      intrigues: 2,
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "ESTABLISH HARPERS SAFE HOUSE",
    requires: {resources: resource(2, 3, 0, 0, 2)},
    reward: {
      points: 8,
      special: {
        type: "two_points_for_each_building_controlled",
      },
      text: "plus 2 Points for each Building you control.",
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "ESTABLISH SHADOW THIEVES' GUILD",
    requires: {resources: resource(1, 8, 1, 0, 0)},
    reward: {
      points: 25,
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "INSTALL A SPY IN CASTLE WATERDEEP",
    requires: {resources: resource(0, 4, 0, 0, 4)},
    reward: {
      points: 8,
      special: {
        questBonusType: "SKULLDUGGERY",
        questBonusPoints: 2,
      },
      text: "Whenever you complete a Skullduggery Quest, you score 2 Points.",
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "BUILD A REPUTATION IN SKULLPORT",
    requires: {resources: resource(1, 3, 0, 0, 4)},
    reward: {
      points: 10,
      intrigues: 1,
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "EXPOSE CULT CORRUPTION",
    requires: {resources: resource(0, 4, 0, 1, 0)},
    reward: {
      points: 4,
      resources: resource(0, 0, 0, 2, 0),
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "STEAL FROM HOUSE ADARBRENT",
    requires: {resources: resource(1, 4, 1, 0, 0)},
    reward: {
      points: 10,
      resources: resource(0, 0, 0, 0, 6),
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "PLACE A SLEEPER AGENT IN SKULLPORT",
    requires: {resources: resource(1, 4, 1, 0, 0)},
    reward: {
      points: 0,
      special: {
        type: "two_points_when_you_play_intrigue",
      },
      text: "Whenever you play an Intrigue, you score 2 Points",
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "FENCE GOODS FOR DUKE OF DARKNESS",
    requires: {resources: resource(1, 3, 0, 0, 4)},
    reward: {
      points: 6,
      special: {
        type: "on_receiving_black_get_two_gold",
      },
      text:
        "Whenever you take an action that provides any Black Cubes, also take 2 Gold from the supply.",
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "RAID ON UNDERMOUNTAIN",
    requires: {resources: resource(2, 4, 1, 1, 0)},
    reward: {
      points: 20,
      resources: resource(0, 0, 0, 0, 2),
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "TAKE OVER RIVAL ORGANIZATION",
    requires: {resources: resource(1, 2, 1, 0, 6)},
    reward: {
      points: 10,
      resources: resource(0, 4, 0, 0, 0),
    },
  },
  {
    type: "SKULLDUGGERY",
    name: "PRISON BREAK",
    requires: {resources: resource(0, 4, 2, 0, 2)},
    reward: {
      points: 14,
      resources: resource(2, 0, 0, 0, 0),
      special: {
        type: "play_intrigue",
      },
      text: "and immediately play an Intrigue without taking an action.",
    },
  },
  {
    type: "WARFARE",
    name: "REPEL SEAWRAITHS",
    requires: {resources: resource(4, 0, 1, 1, 0)},
    reward: {
      points: 15,
      resources: resource(0, 0, 0, 0, 2),
    },
  },
  {
    type: "WARFARE",
    name: "DEFEAT UPRISING FROM UNDERMOUNTAIN",
    requires: {resources: resource(3, 1, 0, 1, 2)},
    reward: {
      points: 11,
      resources: resource(2, 0, 0, 0, 0),
    },
  },
  {
    type: "WARFARE",
    name: "AMBUSH ARTOR MORLIN",
    requires: {resources: resource(3, 1, 0, 1, 0)},
    reward: {
      points: 8,
      resources: resource(0, 0, 0, 0, 4),
    },
  },
  {
    type: "WARFARE",
    name: "DELIVER AN ULTIMATUM",
    requires: {resources: resource(4, 1, 1, 0, 0)},
    reward: {
      points: 11,
      resources: resource(0, 0, 0, 0, 4),
    },
  },
  {
    type: "WARFARE",
    name: "TRAIN BLADESINGERS",
    requires: {resources: resource(3, 0, 1, 0, 0)},
    reward: {
      points: 4,
      resources: resource(1, 0, 1, 0, 0),
    },
  },
  {
    type: "WARFARE",
    name: "BOLSTER GRIFFON CAVALRY",
    requires: {resources: resource(4, 0, 0, 0, 4)},
    reward: {
      points: 6,
      special: {
        type: "on_receiving_orange_get_orangeCube",
      },
      text:
        "Whenever you take an action that provides any Orange Cubes, also take an Orange Cube from the supply and place it in your Tavern.",
    },
  },
  {
    type: "WARFARE",
    name: "RAID ORC STRONGHOLD",
    requires: {resources: resource(4, 2, 0, 0, 0)},
    reward: {
      points: 8,
      resources: resource(0, 0, 0, 0, 4),
    },
  },
  {
    type: "WARFARE",
    name: "QUELL MERCENARY UPRISING",
    requires: {resources: resource(4, 0, 0, 1, 0)},
    reward: {
      points: 8,
      special: {
        questBonusType: "WARFARE",
        questBonusPoints: 2,
      },
      text: "Whenever you complete a Warfare Quest, you score 2 Points.",
    },
  },
  {
    type: "WARFARE",
    name: "DELIVER WEAPONS TO SELUNE'S TEMPLE",
    requires: {resources: resource(4, 1, 1, 0, 2)},
    reward: {
      points: 9,
      resources: resource(0, 0, 0, 2, 0),
    },
  },
  {
    type: "WARFARE",
    name: "BOLSTER CITY GUARD",
    requires: {resources: resource(9, 2, 0, 0, 0)},
    reward: {
      points: 25,
    },
  },
  {
    type: "WARFARE",
    name: "RECRUIT LIEUTENANT",
    requires: {resources: resource(5, 1, 1, 1, 0)},
    reward: {
      points: 0,
      special: {
        type: "own_lieutenant",
      },
      text: "Add the Lieutenant to your pool for the rest of the game.",
    },
  },
  {
    type: "WARFARE",
    name: "CONFRONT THE XANATHAR",
    requires: {resources: resource(4, 2, 1, 1, 0)},
    reward: {
      points: 20,
      resources: resource(0, 0, 0, 0, 2),
    },
  },
];

module.exports.intrigues = [
  {
    type: "UTILITY",
    name: "REAL ESTATE DEAL",
    key: "REAL ESTATE DEAL" + 1,
    requires: {buildingYouControlWithNoPiecesOnIt: 1},
    reward: {
      special: {
        type: "discard_building",
      },
    },
    text:
      "Discard a Building under your control that currently has no People assigned to it. Then choose 1 Building in Builder's Hall and put it in play under your control at no cost. (Replace that Building afterward.)",
  },
  {
    type: "UTILITY",
    name: "CHANGE OF PLANS",
    key: "CHANGE OF PLANS" + 1,
    requires: {quests: 1},
    reward: {
      special: {
        type: "discard_quest",
        points: 6,
        otherPlayerPoints: 3,
      },
    },
    text:
      "Discard an uncompleted Quest. Score 6 Points. Each opponent can choose to discard an uncompleted Quest to score 3 Points. (You can discard a Mandatory Quest in this way.)",
  },
  {
    type: "UTILITY",
    name: "ACCELERATE PLANS",
    key: "ACCELERATE PLANS" + 1,
    requires: {pieces: 1},
    reward: {
      special: {
        type: "return_piece_and_go_twice_in_a_row",
      },
    },
    text:
      "Choose 1 of your People assigned to Waterdeep Harbor. Return it to your pool, then immediately assign 2 People",
  },
  {
    type: "UTILITY",
    name: "SUMMON THE FAITHFUL",
    key: "SUMMON THE FAITHFUL" + 1,
    reward: {
      resources: resource(0, 0, 0, 1, 0),
      special: {
        type: "Each opponent choice to give resource for points",
        resources: resource(0, 0, 0, 1, 0),
        points: 5,
      },
    },
    text:
      "Take 1 White Cube from the supply and place it in your Tavern. Each opponent can choose to give you 1 White Cube once to score 5 Points. (Place it in your Tavern.)",
  },
  {
    type: "UTILITY",
    name: "RECRUIT SPIES",
    key: "RECRUIT SPIES" + 1,
    reward: {
      resources: resource(0, 2, 0, 0, 0),
      special: {
        type: "Each opponent choice to give resource for points",
        resources: resource(0, 1, 0, 0, 0),
        points: 3,
      },
    },
    text:
      "Take 2 Black Cubes from the supply and place them in your Tavern. Each opponent can choose to give you 1 Black Cube once to score 3 Points. (Place it in your Tavern.)",
  },
  {
    type: "UTILITY",
    name: "RESEARCH AGREEMENT",
    key: "RESEARCH AGREEMENT" + 1,
    reward: {
      resources: resource(0, 0, 1, 0, 0),
      special: {
        type: "Each opponent choice to give resource for points",
        resources: resource(0, 0, 1, 0, 0),
        points: 5,
      },
    },
    text:
      "Take 1 Purple Cube from the supply and place it in your Tavern. Each opponent can choose to give you 1 Purple Cube once to score 5 Points. (Place it in your Tavern.)",
  },
  {
    type: "UTILITY",
    name: "REQUEST ASSISTANCE",
    key: "REQUEST ASSISTANCE" + 1,
    reward: {
      resources: resource(2, 0, 0, 0, 0),
      special: {
        type: "Each opponent choice to give resource for points",
        resources: resource(1, 0, 0, 0, 0),
        points: 3,
      },
    },
    text:
      "Take 2 Orange Cubes from the supply and place them in your Tavern. Each opponent can choose to give you 1 Orange Cube once to score 3 Points. (Place it in your Tavern.)",
  },
  {
    type: "UTILITY",
    name: "TAX COLLECTION",
    key: "TAX COLLECTION" + 1,
    reward: {
      resources: resource(0, 0, 0, 0, 4),
      special: {
        type: "Each opponent choice to give resource for points",
        resources: resource(0, 0, 0, 0, 4),
        points: 4,
      },
    },
    text:
      "Take 4 Gold from the supply. Each opponent can choose to pay you 4 Gold once to score 4 Points.",
  },
  {
    type: "UTILITY",
    name: "TAX COLLECTION",
    key: "TAX COLLECTION" + 2,
    reward: {
      resources: resource(0, 0, 0, 0, 4),
      special: {
        type: "Each opponent choice to give resource for points",
        resources: resource(0, 0, 0, 0, 4),
        points: 4,
      },
    },
    text:
      "Take 4 Gold from the supply. Each opponent can choose to pay you 4 Gold once to score 4 Points.",
  },
  {
    type: "UTILITY",
    name: "SPECIAL ASSIGNMENT",
    key: "SPECIAL ASSIGNMENT" + 1,
    reward: {
      special: {
        type: "Choose_Quest_Type",
      },
    },
    text:
      "Choose a Quest type: Arcana, Commerce, Piety, Skullduggery, or Warfare. Draw and reveal a Quest from the deck until you reveal a card of the chosen type. Keep that Quest and discard the rest.",
  },
  {
    type: "UTILITY",
    name: "SPECIAL ASSIGNMENT",
    key: "SPECIAL ASSIGNMENT" + 2,
    reward: {
      special: {
        type: "Choose_Quest_Type",
      },
    },
    text:
      "Choose a Quest type: Arcana, Commerce, Piety, Skullduggery, or Warfare. Draw and reveal a Quest from the deck until you reveal a card of the chosen type. Keep that Quest and discard the rest.",
  },
  {
    type: "UTILITY",
    name: "BIDDING WAR",
    key: "BIDDING WAR" + 1,
    reward: {
      special: {
        type: "draw_quest_for_all_players",
      },
    },
    text:
      "Draw a Quest from the deck equal to the number of players. Keep one and pass the remaining Quests to the player on your left. Each player, in turn, chooses one Quest to keep and passes the rest to the left until every player has taken a Quest.",
  },
  {
    type: "UTILITY",
    name: "BIDDING WAR",
    key: "BIDDING WAR" + 2,
    reward: {
      special: {
        type: "draw_quest_for_all_players",
      },
    },
    text:
      "Draw a Quest from the deck equal to the number of players. Keep one and pass the remaining Quests to the player on your left. Each player, in turn, chooses one Quest to keep and passes the rest to the left until every player has taken a Quest.",
  },
  {
    type: "UTILITY",
    name: "BIDDING WAR",
    key: "BIDDING WAR" + 3,
    reward: {
      special: {
        type: "draw_quest_for_all_players",
      },
    },
    text:
      "Draw a Quest from the deck equal to the number of players. Keep one and pass the remaining Quests to the player on your left. Each player, in turn, chooses one Quest to keep and passes the rest to the left until every player has taken a Quest.",
  },
  {
    type: "UTILITY",
    name: "SAMPLE WARES",
    key: "SAMPLE WARES" + 1,
    requires: {pieces: 1},
    reward: {
      special: {
        type: "go_on_buildersHall_spot",
      },
    },
    text:
      "Assign 1 of your unused People to a Building in Builder's Hall. You immediately use the effect of that Building as though you controlled it.",
  },
  {
    type: "UTILITY",
    name: "SAMPLE WARES",
    key: "SAMPLE WARES" + 2,
    requires: {pieces: 1},
    reward: {
      special: {
        type: "go_on_buildersHall_spot",
      },
    },
    text:
      "Assign 1 of your unused People to a Building in Builder's Hall. You immediately use the effect of that Building as though you controlled it.",
  },
  {
    type: "UTILITY",
    name: "RECALL AGENT",
    key: "RECALL AGENT" + 1,
    reward: {
      special: {
        type: "return_1_to_pool",
      },
    },
    text: "Return 1 of your assigned People to your pool.",
  },
  {
    type: "UTILITY",
    name: "RECALL AGENT",
    key: "RECALL AGENT" + 2,
    reward: {
      special: {
        type: "return_1_to_pool",
      },
    },
    text: "Return 1 of your assigned People to your pool.",
  },
  {
    type: "UTILITY",
    name: "CRIME WAVE",
    key: "CRIME WAVE" + 1,
    reward: {
      resources: resource(0, 2, 0, 0, 0),
      special: {
        type: "Give resource to another player",
        resources: resource(0, 1, 0, 0, 0),
      },
    },
    text:
      "Take 2 Black Cubes from the supply and place them in your Tavern. Choose 1 opponent. That opponent takes a Black Cube from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "CRIME WAVE",
    key: "CRIME WAVE" + 2,
    reward: {
      resources: resource(0, 2, 0, 0, 0),
      special: {
        type: "Give resource to another player",
        resources: resource(0, 1, 0, 0, 0),
      },
    },
    text:
      "Take 2 Black Cubes from the supply and place them in your Tavern. Choose 1 opponent. That opponent takes a Black Cube from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "SPREAD THE WEALTH",
    key: "SPREAD THE WEALTH" + 1,
    reward: {
      resources: resource(0, 0, 0, 0, 4),
      special: {
        type: "Give resource to another player",
        resources: resource(0, 0, 0, 0, 2),
      },
    },
    text:
      "Take 4 Gold from the supply and choose 1 opponent. That opponent takes 2 Gold from the supply.",
  },
  {
    type: "UTILITY",
    name: "SPREAD THE WEALTH",
    key: "SPREAD THE WEALTH" + 2,
    reward: {
      resources: resource(0, 0, 0, 0, 4),
      special: {
        type: "Give resource to another player",
        resources: resource(0, 0, 0, 0, 2),
      },
    },
    text:
      "Take 4 Gold from the supply and choose 1 opponent. That opponent takes 2 Gold from the supply.",
  },
  {
    type: "UTILITY",
    name: "GOOD FAITH",
    key: "GOOD FAITH" + 1,
    reward: {
      resources: resource(0, 0, 0, 2, 0),
      special: {
        type: "Give resource to another player",
        resources: resource(0, 0, 0, 1, 0),
      },
    },
    text:
      "Take 2 White Cubes from the supply and place them in your Tavern. Choose 1 opponent. That opponent takes a White Cube from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "GOOD FAITH",
    key: "GOOD FAITH" + 2,
    reward: {
      resources: resource(0, 0, 0, 2, 0),
      special: {
        type: "Give resource to another player",
        resources: resource(0, 0, 0, 1, 0),
      },
    },
    text:
      "Take 2 White Cubes from the supply and place them in your Tavern. Choose 1 opponent. That opponent takes a White Cube from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "GRADUATION DAY",
    key: "GRADUATION DAY" + 1,
    reward: {
      resources: resource(0, 0, 2, 0, 0),
      special: {
        type: "Give resource to another player",
        resources: resource(0, 0, 1, 0, 0),
      },
    },
    text:
      "Take 2 Purple Cubes from the supply and place them in your Tavern. Choose 1 opponent. That opponent takes a Purple Cube from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "GRADUATION DAY",
    key: "GRADUATION DAY" + 2,
    reward: {
      resources: resource(0, 0, 2, 0, 0),
      special: {
        type: "Give resource to another player",
        resources: resource(0, 0, 1, 0, 0),
      },
    },
    text:
      "Take 2 Purple Cubes from the supply and place them in your Tavern. Choose 1 opponent. That opponent takes a Purple Cube from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "CONSCRIPTION",
    key: "CONSCRIPTION" + 1,
    reward: {
      resources: resource(2, 0, 0, 0, 0),
      special: {
        type: "Give resource to another player",
        resources: resource(1, 0, 0, 0, 0),
      },
    },
    text:
      "Take 2 Orange Cubes from the supply and place them in your Tavern. Choose 1 opponent. That opponent takes a Orange Cube from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "CONSCRIPTION",
    key: "CONSCRIPTION" + 2,
    reward: {
      resources: resource(2, 0, 0, 0, 0),
      special: {
        type: "Give resource to another player",
        resources: resource(1, 0, 0, 0, 0),
      },
    },
    text:
      "Take 2 Orange Cubes from the supply and place them in your Tavern. Choose 1 opponent. That opponent takes a Orange Cube from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "CALL FOR ADVENTURERS",
    key: "CALL FOR ADVENTURERS" + 1,
    reward: {
      resources: resource(0, 0, 0, 0, 0, 2),
      special: {
        type: "resource_to_all_players",
        resources: resource(0, 0, 0, 0, 0, 1),
      },
    },
    text:
      "Take 2 Cubes Of Your Choosing from the supply and place them in your Tavern. Each opponent takes a Cube of Their Choosing from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "CALL FOR ADVENTURERS",
    key: "CALL FOR ADVENTURERS" + 2,
    reward: {
      resources: resource(0, 0, 0, 0, 0, 2),
      special: {
        type: "resource_to_all_players",
        resources: resource(0, 0, 0, 0, 0, 1),
      },
    },
    text:
      "Take 2 Cubes Of Your Choosing from the supply and place them in your Tavern. Each opponent takes a Cube of Their Choosing from the supply and places it in his or her Tavern.",
  },
  {
    type: "UTILITY",
    name: "CALL IN A FAVOR",
    key: "CALL IN A FAVOR" + 1,
    reward: {
      special: {
        type: "choose_resource",
      },
    },
    text:
      "Choose one of the following to take from the supply: 4 Gold, 2 Orange Cubes, 2 Black Cubes, 1 Purple Cube, or 1 White Cube",
  },
  {
    type: "UTILITY",
    name: "CALL IN A FAVOR",
    key: "CALL IN A FAVOR" + 2,
    reward: {
      special: {
        type: "choose_resource",
      },
    },
    text:
      "Choose one of the following to take from the supply: 4 Gold, 2 Orange Cubes, 2 Black Cubes, 1 Purple Cube, or 1 White Cube",
  },
  {
    type: "ATTACK",
    name: "FREE DRINKS!",
    key: "FREE DRINKS!" + 1,
    reward: {
      special: {
        type: "remove_cube_of_choice",
      },
    },
    text:
      "Remove a Cube of Your Choice from an opponent's Tavern, and then place it in your Tavern.",
  },
  {
    type: "ATTACK",
    name: "FREE DRINKS!",
    key: "FREE DRINKS!" + 2,
    reward: {
      special: {
        type: "remove_cube_of_choice",
      },
    },
    text:
      "Remove a Cube of Your Choice from an opponent's Tavern, and then place it in your Tavern.",
  },
  {
    type: "ATTACK",
    name: "ARCANE MISHAP",
    key: "ARCANE MISHAP" + 1,
    reward: {
      special: {
        type: "each_opp_remove_cube",
        resources: resource(0, 0, 1, 0, 0),
        rewardIfDontHave: {intrigues: 1},
      },
    },
    text:
      "Each opponent removes a Purple Cube from his or her Tavern and returns it to the supply. For each opponent that could not do so, draw an Intrigue",
  },
  {
    type: "ATTACK",
    name: "ARCANE MISHAP",
    key: "ARCANE MISHAP" + 2,
    reward: {
      special: {
        type: "each_opp_remove_cube",
        resources: resource(0, 0, 1, 0, 0),
        rewardIfDontHave: {intrigues: 1},
      },
    },
    text:
      "Each opponent removes a Purple Cube from his or her Tavern and returns it to the supply. For each opponent that could not do so, draw an Intrigue",
  },
  {
    type: "ATTACK",
    name: "LACK OF FAITH",
    key: "LACK OF FAITH" + 1,
    reward: {
      special: {
        type: "each_opp_remove_cube",
        resources: resource(0, 0, 0, 1, 0),
        rewardIfDontHave: {points: 2},
      },
    },
    text:
      "Each opponent removes a White Cube from his or her Tavern and returns it to the supply. For each opponent that could not do so, you score 2 Points.",
  },
  {
    type: "ATTACK",
    name: "LACK OF FAITH",
    key: "LACK OF FAITH" + 2,
    reward: {
      special: {
        type: "each_opp_remove_cube",
        resources: resource(0, 0, 0, 1, 0),
        rewardIfDontHave: {points: 2},
      },
    },
    text:
      "Each opponent removes a White Cube from his or her Tavern and returns it to the supply. For each opponent that could not do so, you score 2 Points.",
  },
  {
    type: "ATTACK",
    name: "ASSASSINATION",
    key: "ASSASSINATION" + 1,
    reward: {
      special: {
        type: "each_opp_remove_cube",
        resources: resource(0, 1, 0, 0, 0),
        rewardIfDontHave: {resources: resource(0, 0, 0, 0, 2)},
      },
    },
    text:
      "Each opponent removes a Black Cube from his or her Tavern and returns it to the supply. For each opponent that could not do so, take 2 Gold from the supply and place it in your Tavern.",
  },
  {
    type: "ATTACK",
    name: "ASSASSINATION",
    key: "ASSASSINATION" + 2,
    reward: {
      special: {
        type: "each_opp_remove_cube",
        resources: resource(0, 1, 0, 0, 0),
        rewardIfDontHave: {resources: resource(0, 0, 0, 0, 2)},
      },
    },
    text:
      "Each opponent removes a Black Cube from his or her Tavern and returns it to the supply. For each opponent that could not do so, take 2 Gold from the supply and place it in your Tavern.",
  },
  {
    type: "ATTACK",
    name: "AMBUSH",
    key: "AMBUSH" + 1,
    reward: {
      special: {
        type: "each_opp_remove_cube",
        resources: resource(1, 0, 0, 0, 0),
        rewardIfDontHave: {resources: resource(1, 0, 0, 0, 0)},
      },
    },
    text:
      "Each opponent removes a Orange Cube from his or her Tavern and returns it to the supply. For each opponent that could not do so, take a Orange Cube from the supply and place it in your Tavern.",
  },
  {
    type: "ATTACK",
    name: "AMBUSH",
    key: "AMBUSH" + 2,
    reward: {
      special: {
        type: "each_opp_remove_cube",
        resources: resource(1, 0, 0, 0, 0),
        rewardIfDontHave: {resources: resource(1, 0, 0, 0, 0)},
      },
    },
    text:
      "Each opponent removes a Orange Cube from his or her Tavern and returns it to the supply. For each opponent that could not do so, take a Orange Cube from the supply and place it in your Tavern.",
  },
  {
    type: "ATTACK",
    name: "BRIBE AGENT",
    key: "BRIBE AGENT" + 1,
    requires: {
      resources: resource(0, 0, 0, 0, 2),
      spotsByOtherPeople: 1,
    },
    reward: {
      special: {
        type: "go_on_opponent_spot",
      },
    },
    text:
      "Pay 2 Gold to the supply. Choose an action space containing an opponent's Person. You use that space's action as though you had assigned a Person to it.",
  },
  {
    type: "ATTACK",
    name: "BRIBE AGENT",
    key: "BRIBE AGENT" + 2,
    requires: {
      resources: resource(0, 0, 0, 0, 2),
      spotsByOtherPeople: 1,
    },
    reward: {
      special: {
        type: "go_on_opponent_spot",
      },
    },
    text:
      "Pay 2 Gold to the supply. Choose an action space containing an opponent's Person. You use that space's action as though you had assigned a Person to it.",
  },
  {
    type: "MANDATORY QUEST",
    name: "STAMP OUT CULTISTS",
    key: "STAMP OUT CULTISTS",
    text:
      "Give this Mandatory Quest to an opponent. That opponent cannot complete any non-Mandatory Quests until this Quest is completed.",
    requires: {resources: resource(1, 1, 0, 1, 0)},
    reward: {
      points: 2,
    },
  },
  {
    type: "MANDATORY QUEST",
    name: "FOIL THE ZHENTARIM",
    key: "FOIL THE ZHENTARIM",
    text:
      "Give this Mandatory Quest to an opponent. That opponent cannot complete any non-Mandatory Quests until this Quest is completed.",
    requires: {resources: resource(1, 1, 1, 0, 0)},
    reward: {
      points: 2,
    },
  },
  {
    type: "MANDATORY QUEST",
    name: "REPEL DROW INVADERS",
    key: "REPEL DROW INVADERS",
    text:
      "Give this Mandatory Quest to an opponent. That opponent cannot complete any non-Mandatory Quests until this Quest is completed.",
    requires: {resources: resource(0, 2, 0, 1, 0)},
    reward: {
      points: 2,
    },
  },
  {
    type: "MANDATORY QUEST",
    name: "FEND OFF BANDITS",
    key: "FEND OFF BANDITS",
    text:
      "Give this Mandatory Quest to an opponent. That opponent cannot complete any non-Mandatory Quests until this Quest is completed.",
    requires: {resources: resource(2, 0, 1, 0, 0)},
    reward: {
      points: 2,
    },
  },
  {
    type: "MANDATORY QUEST",
    name: "PLACATE ANGRY MERCHANTS",
    key: "PLACATE ANGRY MERCHANTS",
    text:
      "Give this Mandatory Quest to an opponent. That opponent cannot complete any non-Mandatory Quests until this Quest is completed.",
    requires: {resources: resource(1, 0, 1, 1, 0)},
    reward: {
      points: 4,
    },
  },
  {
    type: "MANDATORY QUEST",
    name: "QUELL RIOTS",
    key: "QUELL RIOTS",
    text:
      "Give this Mandatory Quest to an opponent. That opponent cannot complete any non-Mandatory Quests until this Quest is completed.",
    requires: {resources: resource(1, 0, 0, 2, 0)},
    reward: {
      points: 4,
    },
  },
];

module.exports.lords = [
  {
    name: "DURNAN THE WANDERER",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["COMMERCE", "WARFARE"],
  },
  {
    name: "BRIANNE BYNDRAETH",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["ARCANA", "SKULLDUGGERY"],
  },
  {
    name: "NINDIL JALBUCK",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["PIETY", "SKULLDUGGERY"],
  },
  {
    name: "KYRIANI AGRIVAR",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["ARCANA", "PIETY"],
  },
  {
    name: "NYMARA SCHEIRON",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["COMMERCE", "SKULLDUGGERY"],
  },
  {
    name: "CALADORN CASSALANTER",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["SKULLDUGGERY", "WARFARE"],
  },
  {
    name: "SAMMEREZA SULPHONTIS",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["ARCANA", "COMMERCE"],
  },
  {
    name: "KHELBEN ARUNSUN, THE BLACKSTAFF",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["ARCANA", "WARFARE"],
  },
  {
    name: "PIERGEIRON THE PALADINSON",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["PIETY", "WARFARE"],
  },
  {
    name: "MIRT THE MONEYLENDER",
    text:
      "At the end of the game, you score 4 Points for each Quest of your type that you completed.",
    pointMultiple: 4,
    for: ["COMMERCE", "PIETY"],
  },
  {
    name: "LARISSA NEATHAL",
    text:
      "At the end of the game, you score 6 Points for each Building you control.",
    pointMultiple: 6,
    for: ["BUILDING"],
  },
];
