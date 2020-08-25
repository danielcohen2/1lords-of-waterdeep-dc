// const {getQuestFromCliffwatchInnAndMoveTo} = require("./logic");
// const {completeQuest} = require("./logic");
// const {playIntrigue} = require("./logic");
// const {
//   getBuildingFromBuildersHallAndMoveToBuildingsInPlay,
// } = require("./logic");
// const {deductResources} = require("./logic");
// const {addResources} = require("./logic");
// const {addPoints} = require("./logic");
// const {addQuest} = require("./logic");
// const {questFromTopOfDeck} = require("./logic");
// const {spotPicked} = require("./logic");
// const {unDoPlayerMoveOnSpot} = require("./logic");
// const {getResources} = require("./logic");
// const {addResourcesForPlayer} = require("./logic");
// const {intriguesThatPlayerCanPlay} = require("./logic");
// const {removeItemFromList} = require("./logic");
// const {useActionSpace} = require("./logic");
// const {isSpotsLeftToBuyBuildings} = require("./logic");
// const {enoughResources} = require("./logic");
const {activeQuestsThatPlayerCanComplete} = require("./logic");
const {buildingsThatPlayerCanBuy} = require("./logic");
const {resourceString} = require("./logic");
const {otherPlayers} = require("./logic");
const {buildingsFromBuildersHallThatPlayerCanGoOn} = require("./logic");
const {buildingsThatPlayerCanDiscard} = require("./logic");
const {listOfPlayersThatHaveAtleastOneResourceCube} = require("./logic");

const choiceTypes = (module.exports.choiceTypes = {
  PICK_QUEST_FROM_CWI: {
    STRING: "pick_quest_from_cwi",
    CHOICE_OBJ_FUNCTION: createCliffwatchInnChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleCliffwatchInnChoice,
  },
  COMPLETE_QUEST: {
    STRING: "complete_quest",
    CHOICE_OBJ_FUNCTION: createCompleteQuestChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleCompleteQuestChoice,
  },
  PLAY_INTRIGUE: {
    STRING: "play_intrigue",
    CHOICE_OBJ_FUNCTION: createIntrigueChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleIntrigueChoice,
  },
  BUY_BUILDING: {
    STRING: "buy_building",
    CHOICE_OBJ_FUNCTION: createBuyBuildingChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleBuyBuildingChoice,
  },
  PICK_ANOTHER_PLAYER: {
    STRING: "pick_another_player",
    CHOICE_OBJ_FUNCTION: createAnotherPlayerChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleOtherPlayerChoice,
  },
  RESOURCE: {
    STRING: "resource_choice",
    CHOICE_OBJ_FUNCTION: createResourcesChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleResourcesChoice,
  },
  GIVE_RESOURCE_FOR_POINTS: {
    STRING: "give_resource_for_points",
    CHOICE_OBJ_FUNCTION: createGiveResourceForPointsChoicesObj,
    // AFTER_SELECTION_FUNCTION: handleGiveResourceForPointsChoice,
  },
  GIVE_RESOURCE_TO_PLAYER: {
    STRING: "give_resource_to_player",
    CHOICE_OBJ_FUNCTION: createGiveResourceToAnotherPlayerChoicesObj,
    // AFTER_SELECTION_FUNCTION: handleGiveResourceToAnotherPlayer,
  },
  QUEST_TYPE: {
    STRING: "quest_type",
    CHOICE_OBJ_FUNCTION: createQuestTypeChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleGetFirstQuestOfQuestType,
  },
  DRAW_QUEST_FOR_ALL_PLAYERS: {
    STRING: "draw_quest_for_all_players",
    CHOICE_OBJ_FUNCTION: createQuestChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleQuestForEachPlayer,
  },
  GO_ON_A_BUILDERS_HALL_SPOT: {
    STRING: "go_on_a_buildersHall_spot",
    CHOICE_OBJ_FUNCTION: createGoOnBuildersHallSpotChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleGoOnBuildersHallSpot,
  },
  RETURN_1_TO_POOL: {
    STRING: "return_1_to_pool",
    CHOICE_OBJ_FUNCTION: createReturnToPoolChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleReturnToPool,
  },
  WANT_TO_DISCARD_QUEST: {
    STRING: "want_to_discard_quest",
    CHOICE_OBJ_FUNCTION: createWantToDiscardQuestChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleWantToDiscardQuest,
  },
  DISCARD_QUEST: {
    STRING: "discard_quest",
    CHOICE_OBJ_FUNCTION: createDiscardQuestChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleDiscardQuest,
  },
  DISCARD_BUILDING: {
    STRING: "discard_building",
    CHOICE_OBJ_FUNCTION: createDiscardBuildingChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleDiscardBuilding,
  },
  REPLACE_BUILDING: {
    STRING: "replace_building",
    CHOICE_OBJ_FUNCTION: createReplacementBuildingChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleReplaceBuilding,
  },
  PICK_PLAYER_AND_REMOVE_CUBE_OF_CHOICE: {
    STRING: "pick_player_and_remove_cube_of_choice",
    CHOICE_OBJ_FUNCTION: createPickPlayerAndRemoveCubeChoiceObj,
    // AFTER_SELECTION_FUNCTION: handlePickPlayerAndRemoveCube,
  },

  REMOVE_CUBE_OF_CHOICE: {
    STRING: "remove_cube_of_choice",
    CHOICE_OBJ_FUNCTION: createRemoveCubeChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleRemoveCube,
  },
  GO_ON_OPPONENT_SPOT: {
    STRING: "go_on_opponent_spot",
    CHOICE_OBJ_FUNCTION: createUseAnOpponentsSpotChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleUseOpponentSpot,
  },
  GET_BUILDING_FROM_BH: {
    STRING: "get_building_from_BH",
    CHOICE_OBJ_FUNCTION: createGetBuildingChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleGetBuilding,
  },
  WANT_TO_REPLACE_CUBE_WITH_WHITE_CUBE: {
    STRING: "want_to_replace_cube_with_white_cube",
    CHOICE_OBJ_FUNCTION: createWantToReplaceWithWhiteCubeChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleWantToReplaceWithWhiteCube,
  },
  REPLACE_CUBE_WITH_WHITE_CUBE: {
    STRING: "replace_cube_with_white_cube",
    CHOICE_OBJ_FUNCTION: createReplaceWithWhiteCubeChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleReplaceWithWhiteCube,
  },
  DEDUCT_RESOURCES: {
    STRING: "deduct_resources",
    CHOICE_OBJ_FUNCTION: createDeductResourcesChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleDeductResourcesChoice,
  },
  GET_QUEST_AND_IMMEDIATELY_COMPLETE: {
    STRING: "get_quest_and_immediately_complete",
    CHOICE_OBJ_FUNCTION: createGetQuestImmediatelyCompleteChoiceObj,
    // AFTER_SELECTION_FUNCTION: handleGetQuestImmediatelyCompleteChoice,
  },
});

function getCurrPlayer(game) {
  return game.players[game.currPlayersTurn.id];
}

const makeChoiceNew = (module.exports.makeChoiceNew = function (
  game,
  kindOfChoiceObj,
  playerToChoose,
  updateGame,
  obj,
  playerThatCalledMakeChoiceOrSecondPlayerObj
) {
  return new Promise((resolve) => {
    createChoice(
      game,
      kindOfChoiceObj,
      playerToChoose,
      updateGame,
      obj,
      playerThatCalledMakeChoiceOrSecondPlayerObj
    )
      .then((selectedValue) => {
        //DO WE NEED THIS UPDATE GAME? - causing double render in App - 8/12/20
        // the problem is we need the most recent game to call it iwth, selectedValue is not necessarily game
        // updateGame(game);
        resolve(selectedValue);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

const createChoice = (module.exports.createChoice = function (
  game,
  kindOfChoiceObj,
  playerToChoose,
  updateGame,
  obj,
  playerThatCalledMakeChoiceOrSecondPlayerObj
) {
  return new Promise((resolve) => {
    let choiceObjFunction = kindOfChoiceObj.CHOICE_OBJ_FUNCTION;
    //PROBLEM HERE -> functions inside of choiceObjFunction aren't "functions"
    let choiceObj = choiceObjFunction(
      game,
      obj,
      playerThatCalledMakeChoiceOrSecondPlayerObj,
      playerToChoose
    );
    let additonalObj = obj;
    if (!choiceObj.optionsList.length) {
      //if there are no choices to be made?? added checks to prevent this from happening in first place
      game.gameLog.log.unshift({
        player: playerToChoose,
        content: choiceObj.error,
      });
      resolve(game);
    } else {
      let choiceObjsArr;
      if (
        choiceObjFunction === createResourcesChoiceObj ||
        choiceObjFunction === createRemoveCubeChoiceObj ||
        choiceObjFunction === createReplaceWithWhiteCubeChoiceObj
      ) {
        choiceObjsArr = createResourceOptions(
          choiceObj.resourceAmounts,
          choiceObj.component
        );
        obj = choiceObj.resourceAmounts;
      } else if (choiceObjFunction === createDeductResourcesChoiceObj) {
        choiceObjsArr = createDiffResourceOptions(
          choiceObj.resourceAmountsArr,
          choiceObj.component
        );
        obj = choiceObj.resourceAmountsArr;
      } else {
        choiceObjsArr = createOptions(
          choiceObj.optionsList,
          choiceObj.component,
          choiceObj.optionKey,
          choiceObj.optionValue
        );
      }
      openModal(
        game,
        kindOfChoiceObj,
        choiceObjsArr,
        choiceObj.numberOfOptions,
        playerToChoose,
        choiceObj.modalPrompt,
        updateGame,
        obj,
        choiceObj.canExitModal,
        playerThatCalledMakeChoiceOrSecondPlayerObj,
        additonalObj
      ).then((value) => resolve(value));
    }
  });
});

const createOptions = (module.exports.createOptions = function (
  optionsList,
  componentType,
  optionKey,
  optionValue
) {
  const options = optionsList.map((option) => {
    let value;
    if (!optionValue && !optionKey) {
      value = option;
    } else if (optionValue) {
      value = optionValue;
    } else {
      if (option[optionKey]) value = option[optionKey];
      else value = option["shortName"]; //rare situation for boardSpot that has no name attribute
    }
    return {value, componentType, component: option};
  });
  return options;
});

const createResourceOptions = (module.exports.createResourceOptions = function (
  resourceAmounts,
  componentType
) {
  let resourceObjForComp;
  let options = [];
  Object.keys(resourceAmounts).forEach((resourceName) => {
    if (resourceAmounts[resourceName] !== 0) {
      let resourceObj = {};
      resourceObj[resourceName] = resourceAmounts[resourceName];
      resourceObjForComp = {resources: resourceObj};
      options.push({
        value: resourceName,
        component: {obj: resourceObjForComp, resourceName},
        componentType,
        // component: this.resourceComponent(resourceObjForComp, resourceName),
      });
    }
  });
  return options;
});

const createDiffResourceOptions = (module.exports.createDiffResourceOptions = function (
  resourceAmountsArr,
  componentType
) {
  let resourceObjForComp;
  let optionsArr = [];
  for (let i = 0; i < resourceAmountsArr.length; i++) {
    let options = [];
    let resourceAmounts = resourceAmountsArr[i];
    Object.keys(resourceAmounts).forEach((resourceName) => {
      if (resourceAmounts[resourceName] !== 0) {
        let resourceObj = {};
        resourceObj[resourceName] = resourceAmounts[resourceName];
        resourceObjForComp = {resources: resourceObj};
        options.push({
          value: resourceName,
          component: {obj: resourceObjForComp, resourceName},
          componentType,
        });
      }
    });
    optionsArr.push(options);
  }
  return optionsArr;
});

const openModal = (module.exports.openModal = function (
  game,
  kindOfChoiceObj,
  choiceObjsArr,
  numberOfOptions,
  playerToChoose,
  prompt,
  updateGame,
  objForHelperFunction,
  canExitModal,
  playerThatCalledMakeChoiceOrSecondPlayerObj,
  additionalObjForHelperFunction
) {
  return new Promise((resolve) => {
    let player = game.players[playerToChoose.id];
    let optionsList = [];
    if (choiceObjsArr[0].length) {
      //special case for diffResourcesOptions where choiceObjsArr has potentially different arrays in it
      optionsList = choiceObjsArr;
    } else {
      for (let i = 0; i < numberOfOptions; i++) {
        optionsList.push(choiceObjsArr);
      }
    }

    let choiceObj = {
      playerID: player.id,
      kindOfChoice: kindOfChoiceObj.STRING,
      options: optionsList,
      prompt,
      canExitModal,
      objForHelperFunction,
      playerThatCalledMakeChoiceOrSecondPlayerObj,
      additionalObjForHelperFunction,
    };
    addToChoiceQueue(game, player, choiceObj, updateGame);
    resolve(game);
  });
});

const addToChoiceQueue = (module.exports.addToChoiceQueue = function (
  game,
  playerToChoose,
  playerChoiceObj,
  updateGame
) {
  playerToChoose.choiceQueue.push(playerChoiceObj);
  //do i need updateGame here? - I don't think so
  // updateGame(game);
});

function createResourcesChoiceObj(game, obj) {
  let numberOfOptions;
  let resourceAmounts;
  if (obj && obj.length) {
    //obj.length means it is a resourceChoice (i.e. orange OR black) which is array of resource choices (i.e orange/black x 4 or white/purple x2 or ownerReward black/white)
    numberOfOptions = obj.length;
    resourceAmounts = obj[0];
  } else if (obj && obj.choice) {
    //obj.choice means that it is a choice cube
    numberOfOptions = obj.choice;
    resourceAmounts = {orange: 1, black: 1, purple: 1, white: 1};
  } else {
    //just a normal classic resource choice
    numberOfOptions = 1;
    resourceAmounts = {orange: 2, black: 2, white: 1, purple: 1, gold: 4};
  }
  return {
    optionsList: [resourceAmounts],
    // choiceLogicHelperFunction: handleResourcesChoice,
    component: "resource",
    numberOfOptions,
    modalPrompt: "Please select which resources you'd like:",
    resourceAmounts,
    error: "No resources to choose?",
  };
}

//Moved all the handle functions to choiceModal (was getting error when calling the handle functions - the helperFunctions from logic.js that were inside the handleFunction wasn't being recognized as a function (even though I use require at the beginning of this file? i.e. addResourcesForPlayer wasn't being recognized in choiceModal onSelect function))

// function handleResourcesChoice(
//   game,
//   player,
//   selectedResourceNamesArr,
//   onUpdateGame,
//   resourceAmounts,
//   playerToReceive,
//   additionalResourceObj
// ) {
//   return new Promise((resolve) => {
//     game.gameLog.log.unshift({
//       player,
//       content: player.name + " selected " + selectedResourceNamesArr,
//     });
//     let resourceObjs = [];
//     for (let i = 0; i < selectedResourceNamesArr.length; i++) {
//       let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
//       Object.keys(resourceObj).forEach((resourceName) => {
//         if (resourceName === selectedResourceNamesArr[i])
//           resourceObj[resourceName] = resourceAmounts[resourceName];
//       });
//       resourceObjs.push(resourceObj);
//     }
//     let totalSelectedResourceObj = combineSelectedResources(resourceObjs);
//     if (!additionalResourceObj) additionalResourceObj = {};
//     let totalReceivedResources = addResourcesForPlayer(
//       game,
//       player,
//       additionalResourceObj,
//       totalSelectedResourceObj
//     );
//     resolve(totalReceivedResources);
//   });
// }

// function combineSelectedResources(totalSelectedResourceObjs) {
//   let totalChosenResources = {};
//   for (let i = 0; i < totalSelectedResourceObjs.length; i++) {
//     totalChosenResources = addResources(
//       totalChosenResources,
//       totalSelectedResourceObjs[i]
//     );
//   }
//   return totalChosenResources;
// }

function createCliffwatchInnChoiceObj(game) {
  return {
    optionsList: game.board.cliffwatchInn,
    // choiceLogicHelperFunction: handleCliffwatchInnChoice,
    component: "quest",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt: "Please select a Quest from Cliffwatch Inn:",
  };
}

// function handleCliffwatchInnChoice(game, player, selectedQuestNameArr) {
//   return new Promise((resolve) => {
//     for (let i = 0; i < game.board.cliffwatchInn.length; i++) {
//       let quest = game.board.cliffwatchInn[i];

//       if (quest.name.trim() === selectedQuestNameArr[0].trim()) {
//         getQuestFromCliffwatchInnAndMoveTo(
//           game,
//           i,
//           player.activeQuests,
//           player.name + " active quests"
//         );
//         resolve(quest);
//         return;
//       }
//       // resolve(quest);
//     }
//   });
// }

function createCompleteQuestChoiceObj(game) {
  return {
    optionsList: activeQuestsThatPlayerCanComplete(getCurrPlayer(game)),
    // choiceLogicHelperFunction: handleCompleteQuestChoice,
    component: "quest",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt: "What Quest would you like to complete?",
    canExitModal: true,
  };
}

// function handleCompleteQuestChoice(
//   game,
//   player,
//   selectedQuestNameArr,
//   onUpdateGame
// ) {
//   return new Promise((resolve) => {
//     let quest = player.activeQuests.find(
//       (quest) => quest.name === selectedQuestNameArr[0]
//     );
//     let message;
//     let questSpecial = quest.reward.special;
//     if (questSpecial) {
//       if (
//         questSpecial.type === "get_building_from_BH" ||
//         questSpecial.type === "get_building_from_stack"
//       ) {
//         if (!isSpotsLeftToBuyBuildings(game)) {
//           if (
//             confirm(
//               "You won't be able to receive all the rewards for this Quest (There are no more spots for additional buildings), are you sure you want to complete this Quest?"
//             )
//           ) {
//             message =
//               player.name +
//               " completed " +
//               quest.name +
//               " but couldn't get Building reward";
//           } else {
//             resolve(null);
//             return;
//           }
//         }
//       }
//     }
//     completeQuest(game, player, quest, onUpdateGame).then((returnedGame) => {
//       resolve(returnedGame);
//     });
//     if (message)
//       game.gameLog.log.unshift({
//         player,
//         content: message,
//       });
//   });
// }

function createIntrigueChoiceObj(game) {
  return {
    optionsList: getCurrPlayer(game).intrigues,
    // choiceLogicHelperFunction: handleIntrigueChoice,
    component: "intrigue",
    optionKey: "key",
    numberOfOptions: 1,
    modalPrompt: "Please select an Intrigue from your hand to play:",
    error: "Don't have any intrigues to play",
  };
}

// function handleIntrigueChoice(
//   game,
//   player,
//   selectedIntrigueKeyArr,
//   onUpdateGame
// ) {
//   return new Promise((resolve) => {
//     let intrigue = player.intrigues.find(
//       (intrigue) => intrigue.key === selectedIntrigueKeyArr[0]
//     );
//     if (intriguesThatPlayerCanPlay(player, game).includes(intrigue)) {
//       playIntrigue(game, player, intrigue, onUpdateGame).then(
//         (returnedGame) => {
//           resolve(returnedGame);
//         }
//       );
//     } else {
//       if (
//         confirm(
//           "You won't be able to receive the rewards for this Intrigue, are you sure you want to select this option?"
//         )
//       ) {
//         game.gameLog.log.unshift({
//           content:
//             player.name +
//             " played " +
//             intrigue.name +
//             " but didn't get rewards",
//           player,
//         });
//         game.intriguesDiscardPile.push(intrigue);
//         removeItemFromList(player.intrigues, intrigue);
//         resolve(game);
//       } else resolve(null);
//     }
//   });
// }

function createBuyBuildingChoiceObj(game) {
  return {
    optionsList: buildingsThatPlayerCanBuy(game, getCurrPlayer(game)),
    // choiceLogicHelperFunction: handleBuyBuildingChoice,
    component: "building",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt: "Please select a building to buy from Builder's Hall:",
    error: "Player can't buy any buildings",
  };
}

// function handleBuyBuildingChoice(game, player, selectedBuildingNameArr) {
//   return new Promise((resolve) => {
//     game.gameLog.log.unshift({
//       player,
//       content: player.name + " chose to buy " + selectedBuildingNameArr,
//     });
//     for (let i = 0; i < game.board.buildersHall.length; i++) {
//       let building = game.board.buildersHall[i];

//       if (building.name === selectedBuildingNameArr[0]) {
//         getBuildingFromBuildersHallAndMoveToBuildingsInPlay(
//           game,
//           player,
//           i,
//           true
//         );
//       }
//       resolve(building);
//     }
//   });
// }

function createAnotherPlayerChoiceObj(game, obj) {
  let objString = obj.type
    ? obj.type + " - Requires: " + resourceString(obj.requires.resources)
    : resourceString(obj);
  return {
    optionsList: otherPlayers(game, getCurrPlayer(game)),
    // choiceLogicHelperFunction: handleOtherPlayerChoice,
    component: "player",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt: "Please select another Player to give " + objString + ":",
  };
}

// function handleOtherPlayerChoice(game, player, selectedOtherPlayerNameArr) {
//   return new Promise((resolve) => {
//     let selectedOtherPlayer;
//     game.players.forEach((player) => {
//       if (player.name === selectedOtherPlayerNameArr[0])
//         selectedOtherPlayer = player;
//     });
//     resolve(selectedOtherPlayer);
//   });
// }

function createGiveResourceForPointsChoicesObj(game, obj, playerToReceive) {
  return {
    optionsList: ["Yes", "No"],
    // choiceLogicHelperFunction: handleGiveResourceForPointsChoice,
    component: "regular",
    numberOfOptions: 1,
    modalPrompt:
      "Would you like to give " +
      resourceString(obj.resources) +
      " to " +
      playerToReceive.name +
      " for " +
      obj.points +
      " points?",
  };
}

// function handleGiveResourceForPointsChoice(
//   game,
//   playerThatSelected,
//   selectedValueArr,
//   onUpdateGame,
//   resourceAmounts,
//   playerToReceive,
//   rewardObjForPlayerToReceive
// ) {
//   return new Promise((resolve) => {
//     if (selectedValueArr[0] === "Yes") {
//       getResources(
//         game,
//         playerToReceive,
//         rewardObjForPlayerToReceive.resources,
//         onUpdateGame,
//         false
//       ).then((returnedGame) => resolve(returnedGame));
//       deductResources(
//         game,
//         playerThatSelected,
//         rewardObjForPlayerToReceive.resources,
//         onUpdateGame
//       );
//       addPoints(game, playerThatSelected, rewardObjForPlayerToReceive.points);
//     } else resolve(game);
//   });
// }

function createGiveResourceToAnotherPlayerChoicesObj(game, specialResource) {
  let objString = resourceString(specialResource);
  return {
    optionsList: otherPlayers(game, getCurrPlayer(game)),
    // choiceLogicHelperFunction: handleGiveResourceToAnotherPlayer,
    component: "player",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt: "Please select another Player to give " + objString + ":",
  };
}

// function handleGiveResourceToAnotherPlayer(
//   game,
//   playerThatSelected,
//   selectedOtherPlayerNameArr,
//   onUpdateGame,
//   resource
// ) {
//   return new Promise((resolve) => {
//     let selectedOtherPlayer;
//     game.players.forEach((player) => {
//       if (player.name === selectedOtherPlayerNameArr[0])
//         selectedOtherPlayer = player;
//     });
//     getResources(
//       game,
//       selectedOtherPlayer,
//       resource,
//       onUpdateGame,
//       false
//     ).then((returnedGame) => resolve(returnedGame));
//   });
// }

function createQuestTypeChoiceObj(game) {
  return {
    optionsList: ["ARCANA", "COMMERCE", "PIETY", "SKULLDUGGERY", "WARFARE"],
    // choiceLogicHelperFunction: handleGetFirstQuestOfQuestType,
    component: "regular",
    numberOfOptions: 1,
    modalPrompt: "What type of Quest would you like?",
  };
}

// function handleGetFirstQuestOfQuestType(
//   game,
//   playerThatSelected,
//   selectedValueArr
// ) {
//   return new Promise((resolve) => {
//     let selectedQuestType = selectedValueArr[0];
//     game.gameLog.log.unshift({
//       player: playerThatSelected,
//       content: playerThatSelected.name + " chose " + selectedQuestType,
//     });
//     let quest = findFirstQuestOfSelectedType(
//       game,
//       playerThatSelected,
//       selectedQuestType
//     );
//     resolve(quest);
//   });
// }

//functions for intrigues with questDeck
// function findFirstQuestOfSelectedType(game, player, questType) {
//   let quest = questFromTopOfDeck(game);
//   while (quest.type !== questType) {
//     addQuest(game, quest, game.questsDiscardPile, "Quest Discard Pile");
//     quest = questFromTopOfDeck(game);
//   }
//   //exits this loop once there's a match, so add that quest to players hand
//   addQuest(game, quest, player.activeQuests, player.name + "'s active quests");
//   return quest;
// }

function createQuestChoiceObj(game, questList) {
  return {
    optionsList: questList,
    // choiceLogicHelperFunction: handleQuestForEachPlayer,
    component: "quest",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt: "Please select a Quest from the list below:",
  };
}

// function handleQuestForEachPlayer(
//   game,
//   playerThatSelected,
//   selectedQuestNameArr,
//   onUpdateGame,
//   questList
// ) {
//   return new Promise((resolve) => {
//     let questsNotPicked = [];
//     for (let i = 0; i < questList.length; i++) {
//       let quest = questList[i];
//       if (quest.name.trim() === selectedQuestNameArr[0].trim()) {
//         game.gameLog.log.unshift({
//           player: playerThatSelected,
//           content: playerThatSelected.name + " selected " + quest.name,
//         });
//         addQuest(
//           game,
//           quest,
//           playerThatSelected.activeQuests,
//           playerThatSelected.name + "'s active quests"
//         );
//       } else {
//         questsNotPicked.push(quest);
//       }
//     }
//     // let indexOfCurrPlayer = game.players.indexOf(playerThatSelected);
//     let indexOfNextPlayer = (playerThatSelected.id + 1) % game.players.length;
//     let nextPlayer = game.players[indexOfNextPlayer];
//     let numberOfQuestsLeft = questsNotPicked.length;
//     if (numberOfQuestsLeft > 1) {
//       makeChoiceNew(
//         game,
//         choiceTypes.DRAW_QUEST_FOR_ALL_PLAYERS,
//         nextPlayer,
//         onUpdateGame,
//         questsNotPicked
//       ).then(resolve(game));
//     } else {
//       game.gameLog.log.unshift({
//         player: nextPlayer,
//         content:
//           "Only 1 Quest left, in list, automatically give to " +
//           nextPlayer.name,
//       });
//       addQuest(
//         game,
//         questsNotPicked[0],
//         nextPlayer.activeQuests,
//         nextPlayer.name + "'s active quests"
//       );
//       resolve(game);
//     }
//   });
// }

function createGoOnBuildersHallSpotChoiceObj(game) {
  return {
    optionsList: buildingsFromBuildersHallThatPlayerCanGoOn(
      game,
      getCurrPlayer(game)
    ),
    // choiceLogicHelperFunction: handleGoOnBuildersHallSpot,
    component: "building",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt:
      "Pleases select one of the buildings from Builder's Hall to assign a Person to:",
    error: "Player can't go on any buildings",
  };
}

// function handleGoOnBuildersHallSpot(
//   game,
//   playerThatSelected,
//   selectedValueArr,
//   onUpdateGame
// ) {
//   return new Promise((resolve) => {
//     let selectedSpotName = selectedValueArr[0];
//     let selectedBuilding;
//     game.board.buildersHall.forEach((building) => {
//       if (building.name === selectedSpotName) selectedBuilding = building;
//     });
//     spotPicked(game, playerThatSelected, selectedBuilding, onUpdateGame).then(
//       (returnedGame) => {
//         // if (returnedGame !== null) {
//         //   game.gameLog.log.unshift({
//         //     player: playerThatSelected,
//         //     content:
//         //       playerThatSelected.name +
//         //       " chose to use one of their unused Pieces to go on " +
//         //       selectedBuilding.name,
//         //   });
//         // }
//         resolve(returnedGame);
//       }
//     );
//   });
// }

function createReturnToPoolChoiceObj(game, spotsPlayedThisRound) {
  return {
    optionsList: spotsPlayedThisRound,
    // choiceLogicHelperFunction: handleReturnToPool,
    component: "spot",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt: "Which Person would you like to return to your Player pool?",
    error: "No Players to return??",
  };
}

// function handleReturnToPool(
//   game,
//   playerThatSelected,
//   selectedValueArr,
//   onUpdateGame,
//   spotsThatPlayerHasBeenOnList
// ) {
//   return new Promise((resolve) => {
//     let selectedSpotNameOrShortName = selectedValueArr[0];
//     let selectedSpot = spotsThatPlayerHasBeenOnList.find((spot) => {
//       if (spot.name) {
//         if (spot.name === selectedSpotNameOrShortName) return spot;
//       } else {
//         if (spot.shortName === selectedSpotNameOrShortName) return spot;
//       }
//     });
//     unDoPlayerMoveOnSpot(game, playerThatSelected, selectedSpot);
//     resolve(game);
//   });
// }

function createWantToDiscardQuestChoiceObj(
  game,
  specialObj,
  playerThatCalledMakeChoice,
  playerToChoose
) {
  let pointsToReceive =
    playerToChoose.name === playerThatCalledMakeChoice.name
      ? specialObj.points
      : specialObj.otherPlayerPoints;
  return {
    optionsList: ["Yes", "No"],
    // choiceLogicHelperFunction: handleWantToDiscardQuest,
    component: "regular",
    numberOfOptions: 1,
    modalPrompt:
      "Would you like to discard a quest for " + pointsToReceive + " points?",
  };
}

// function handleWantToDiscardQuest(
//   game,
//   playerThatSelected,
//   selectedValueArr,
//   onUpdateGame,
//   specialObj,
//   playerThatCalledMakeChoice
// ) {
//   return new Promise((resolve) => {
//     if (selectedValueArr[0] === "Yes") {
//       makeChoiceNew(
//         game,
//         choiceTypes.DISCARD_QUEST,
//         playerThatSelected,
//         onUpdateGame,
//         specialObj,
//         playerThatCalledMakeChoice
//       ).then((returnedGame) => resolve(returnedGame));
//     } else resolve(game);
//   });
// }

function createDiscardQuestChoiceObj(
  game,
  specialObj,
  playerThatCalledMakeChoice,
  playerToChoose
) {
  let pointsToReceive =
    playerToChoose.name === playerThatCalledMakeChoice.name
      ? specialObj.points
      : specialObj.otherPlayerPoints;
  return {
    optionsList: playerToChoose.activeQuests,
    // choiceLogicHelperFunction: handleDiscardQuest,
    component: "quest",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt:
      "Which quest would you like to discard for " +
      pointsToReceive +
      " points?",
  };
}

// function handleDiscardQuest(
//   game,
//   playerThatSelected,
//   selectedQuestNameArr,
//   onUpdateGame,
//   specialObj,
//   playerThatCalledMakeChoice
// ) {
//   return new Promise((resolve) => {
//     let quest = playerThatSelected.activeQuests.find(
//       (quest) => quest.name === selectedQuestNameArr[0]
//     );
//     if (quest.type === "MANDATORY QUEST") {
//       game.intriguesDiscardPile.push(quest);
//       game.gameLog.log.unshift({
//         content: quest.name + " added to Intrigue Discard Pile",
//       });
//     } else {
//       addQuest(game, quest, game.questsDiscardPile, "Quest Discard Pile");
//     }
//     removeItemFromList(playerThatSelected.activeQuests, quest);
//     let pointsToReceive =
//       playerThatSelected.name === playerThatCalledMakeChoice.name
//         ? specialObj.points
//         : specialObj.otherPlayerPoints;

//     addPoints(game, playerThatSelected, pointsToReceive);
//     resolve(game);
//   });
// }

function createDiscardBuildingChoiceObj(game) {
  return {
    optionsList: buildingsThatPlayerCanDiscard(getCurrPlayer(game)),
    // choiceLogicHelperFunction: handleDiscardBuilding,
    component: "building",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt:
      "Please select which of your buildings you would like to discard:",
    error: "Player can't discard any buildings",
  };
}

// function handleDiscardBuilding(
//   game,
//   player,
//   selectedBuildingNameArr,
//   onUpdateGame
// ) {
//   return new Promise((resolve) => {
//     let selectedBuildingToDiscard = game.board.buildingsInPlay.find(
//       (building) => building.name === selectedBuildingNameArr[0]
//     );
//     game.gameLog.log.unshift({
//       player,
//       content:
//         player.name +
//         " selected to discard " +
//         selectedBuildingToDiscard.name +
//         " (building)",
//     });
//     makeChoiceNew(
//       game,
//       choiceTypes.REPLACE_BUILDING,
//       player,
//       onUpdateGame,
//       selectedBuildingToDiscard
//     ).then((returnedGame) => {
//       resolve(returnedGame);
//     });
//   });
// }

function createReplacementBuildingChoiceObj(game) {
  return {
    optionsList: game.board.buildersHall,
    // choiceLogicHelperFunction: handleReplaceBuilding,
    component: "building",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt:
      "Please choose which building from Builder's Hall you want to control:",
  };
}

// function handleReplaceBuilding(
//   game,
//   player,
//   selectedBuildingNameArr,
//   onUpdateGame,
//   discardedBuilding
// ) {
//   return new Promise((resolve) => {
//     //discard old building
//     removeItemFromList(player.buildingsOwned, discardedBuilding);
//     discardedBuilding.ownerID = "";
//     discardedBuilding.inPlay = false;
//     //change discardedBuilding spot in buildingsInPlay spots back to an integer
//     for (let i = 0; i < game.board.buildingsInPlay.length; i++) {
//       let building = game.board.buildingsInPlay[i];
//       if (building.name === discardedBuilding.name) {
//         game.board.buildingsInPlay[i] = i;
//       }
//     }
//     game.buildingsDiscardPile.push(discardedBuilding);

//     //replacement building
//     for (let i = 0; i < game.board.buildersHall.length; i++) {
//       let building = game.board.buildersHall[i];
//       if (building.name === selectedBuildingNameArr[0]) {
//         getBuildingFromBuildersHallAndMoveToBuildingsInPlay(game, player, i);
//       }
//     }
//     resolve(game);
//   });
// }

function createPickPlayerAndRemoveCubeChoiceObj(game) {
  let otherPlayersArr = otherPlayers(game, getCurrPlayer(game));
  let otherPlayersWithAtleastOneResourceCube = listOfPlayersThatHaveAtleastOneResourceCube(
    otherPlayersArr
  );
  return {
    optionsList: otherPlayersWithAtleastOneResourceCube,
    // choiceLogicHelperFunction: handlePickPlayerAndRemoveCube,
    component: "player",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt:
      "Please select another Player to take a cube of your choosing:",
    error: "No Players with atleast one resource cube",
  };
}

// function handlePickPlayerAndRemoveCube(
//   game,
//   playerThatSelected,
//   selectedOtherPlayerNameArr,
//   onUpdateGame
// ) {
//   return new Promise((resolve) => {
//     let selectedOtherPlayer;
//     game.players.forEach((player) => {
//       if (player.name === selectedOtherPlayerNameArr[0])
//         selectedOtherPlayer = player;
//     });
//     game.gameLog.log.unshift({
//       player: playerThatSelected,
//       content:
//         playerThatSelected.name +
//         " selected to take from " +
//         selectedOtherPlayer.name,
//     });
//     makeChoiceNew(
//       game,
//       choiceTypes.REMOVE_CUBE_OF_CHOICE,
//       playerThatSelected,
//       onUpdateGame,
//       selectedOtherPlayer.resources,
//       selectedOtherPlayer
//     ).then((returnedGame) => resolve(returnedGame));
//   });
// }

function createRemoveCubeChoiceObj(
  game,
  resourcesFromPlayerWhoIsBeingTakenAway
) {
  let orange = 0;
  let black = 0;
  let purple = 0;
  let white = 0;
  if (resourcesFromPlayerWhoIsBeingTakenAway.orange >= 1) orange = 1;
  if (resourcesFromPlayerWhoIsBeingTakenAway.black >= 1) black = 1;
  if (resourcesFromPlayerWhoIsBeingTakenAway.purple >= 1) purple = 1;
  if (resourcesFromPlayerWhoIsBeingTakenAway.white >= 1) white = 1;
  let resourceAmounts = {orange, black, purple, white};
  return {
    optionsList: [resourceAmounts],
    // choiceLogicHelperFunction: handleRemoveCube,
    component: "resource",
    numberOfOptions: 1,
    modalPrompt: "What cube type would you like to take?",
    resourceAmounts,
    error: "No resources to choose?",
  };
}

// function handleRemoveCube(
//   game,
//   playerThatSelected,
//   selectedResourceNamesArr,
//   onUpdateGame,
//   resourceAmounts,
//   playerToDeduct
// ) {
//   return new Promise((resolve) => {
//     game.gameLog.log.unshift({
//       player: playerThatSelected,
//       content:
//         playerThatSelected.name +
//         " selected to take a " +
//         selectedResourceNamesArr +
//         " cube",
//     });
//     let resourceObjs = [];
//     for (let i = 0; i < selectedResourceNamesArr.length; i++) {
//       let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
//       Object.keys(resourceObj).forEach((resourceName) => {
//         if (resourceName === selectedResourceNamesArr[i])
//           resourceObj[resourceName] = resourceAmounts[resourceName];
//       });
//       resourceObjs.push(resourceObj);
//     }
//     let totalSelectedResourceObj = combineSelectedResources(resourceObjs);
//     deductResources(
//       game,
//       playerToDeduct,
//       totalSelectedResourceObj,
//       onUpdateGame
//     );
//     getResources(
//       game,
//       playerThatSelected,
//       totalSelectedResourceObj,
//       onUpdateGame,
//       true
//     );
//     resolve(game);
//   });
// }

function createUseAnOpponentsSpotChoiceObj(
  game,
  spotsOpponentsHaveGoneOnThisRound
) {
  return {
    optionsList: spotsOpponentsHaveGoneOnThisRound,
    // choiceLogicHelperFunction: handleUseOpponentSpot,
    component: "spot",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt: "Which space's action would you like to use?",
    error: "No opponents spots",
  };
}

// function handleUseOpponentSpot(
//   game,
//   playerThatSelected,
//   selectedValueArr,
//   onUpdateGame,
//   spotsOpponentsHaveGoneOnThisRound
// ) {
//   return new Promise((resolve) => {
//     let selectedSpotNameOrShortName = selectedValueArr[0];
//     let selectedSpot = spotsOpponentsHaveGoneOnThisRound.find((spot) => {
//       if (spot.name) {
//         if (spot.name === selectedSpotNameOrShortName) return spot;
//       } else {
//         if (spot.shortName === selectedSpotNameOrShortName) return spot;
//       }
//     });
//     let go_on_spot = false;
//     if (playerThatSelected.use_zoarstar) {
//       if (selectedSpot.group === "WATERDEEP HARBOR") go_on_spot = true;
//     }
//     useActionSpace(
//       game,
//       playerThatSelected,
//       selectedSpot,
//       onUpdateGame,
//       go_on_spot
//     ).then((returnedGame) => {
//       if (returnedGame !== null) {
//         game.gameLog.log.unshift({
//           player: playerThatSelected,
//           content:
//             playerThatSelected.name +
//             " chose to use " +
//             selectedSpotNameOrShortName +
//             "'s action space",
//         });
//         if (playerThatSelected.use_zoarstar) {
//           playerThatSelected.use_zoarstar = false;
//         }
//       }
//       resolve(returnedGame);
//     });
//   });
// }

function createGetBuildingChoiceObj(game) {
  return {
    optionsList: game.board.buildersHall,
    // choiceLogicHelperFunction: handleGetBuilding,
    component: "building",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt:
      "Please choose which building from Builder's Hall you want to put into play under your control (at no cost):",
  };
}

// function handleGetBuilding(game, player, selectedBuildingNameArr) {
//   return new Promise((resolve) => {
//     //replacement building
//     for (let i = 0; i < game.board.buildersHall.length; i++) {
//       let building = game.board.buildersHall[i];
//       if (building.name === selectedBuildingNameArr[0]) {
//         getBuildingFromBuildersHallAndMoveToBuildingsInPlay(game, player, i);
//       }
//     }
//     resolve(game);
//   });
// }

function createWantToReplaceWithWhiteCubeChoiceObj(game) {
  return {
    optionsList: ["Yes", "No"],
    // choiceLogicHelperFunction: handleWantToReplaceWithWhiteCube,
    component: "regular",
    numberOfOptions: 1,
    modalPrompt:
      "Would you like to replace an Orange, Black, or Purple Cube in your Tavern with a White Cube?",
  };
}

// function handleWantToReplaceWithWhiteCube(
//   game,
//   playerThatSelected,
//   selectedValueArr,
//   onUpdateGame
// ) {
//   return new Promise((resolve) => {
//     if (selectedValueArr[0] === "Yes") {
//       makeChoiceNew(
//         game,
//         choiceTypes.REPLACE_CUBE_WITH_WHITE_CUBE,
//         playerThatSelected,
//         onUpdateGame
//       ).then((returnedGame) => resolve(returnedGame));
//     } else resolve(game);
//   });
// }

function createReplaceWithWhiteCubeChoiceObj(game) {
  let orange = 0;
  let black = 0;
  let purple = 0;
  if (getCurrPlayer(game).resources.orange >= 1) orange = 1;
  if (getCurrPlayer(game).resources.black >= 1) black = 1;
  if (getCurrPlayer(game).resources.purple >= 1) purple = 1;
  let resourceAmounts = {orange, black, purple};
  return {
    optionsList: [resourceAmounts],
    // choiceLogicHelperFunction: handleReplaceWithWhiteCube,
    component: "resource",
    numberOfOptions: 1,
    modalPrompt: "What cube type would you like to swap for a White Cube?",
    resourceAmounts,
    error: "No resources to choose?",
  };
}

// function handleReplaceWithWhiteCube(
//   game,
//   playerThatSelected,
//   selectedResourceNamesArr,
//   onUpdateGame,
//   resourceAmounts
// ) {
//   return new Promise((resolve) => {
//     game.gameLog.log.unshift({
//       player: playerThatSelected,
//       content:
//         playerThatSelected.name +
//         " selected to replace a " +
//         selectedResourceNamesArr +
//         " cube with a white cube",
//     });
//     let resourceObjs = [];
//     for (let i = 0; i < selectedResourceNamesArr.length; i++) {
//       let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
//       Object.keys(resourceObj).forEach((resourceName) => {
//         if (resourceName === selectedResourceNamesArr[i])
//           resourceObj[resourceName] = resourceAmounts[resourceName];
//       });
//       resourceObjs.push(resourceObj);
//     }
//     let totalSelectedResourceObj = combineSelectedResources(resourceObjs);
//     deductResources(
//       game,
//       playerThatSelected,
//       totalSelectedResourceObj,
//       onUpdateGame
//     );
//     addResourcesForPlayer(game, playerThatSelected, {white: 1}, {});
//     playerThatSelected.replace_cube_with_white_cube = false;
//     resolve(game);
//   });
// }

function createDeductResourcesChoiceObj(game, obj, p, playerToChoose) {
  let numberOfOptions = obj.choice;
  let optionsArr = [];
  let player_orange = playerToChoose.resources.orange;
  let player_black = playerToChoose.resources.black;
  let player_purple = playerToChoose.resources.purple;
  let player_white = playerToChoose.resources.white;
  for (let i = 0; i < numberOfOptions; i++) {
    let orange = 0;
    let black = 0;
    let purple = 0;
    let white = 0;
    if (player_orange > 0) orange = 1;
    if (player_black > 0) black = 1;
    if (player_purple > 0) purple = 1;
    if (player_white > 0) white = 1;
    optionsArr.push({orange, black, purple, white});
    player_orange--;
    player_black--;
    player_purple--;
    player_white--;
  }
  return {
    optionsList: optionsArr,
    // choiceLogicHelperFunction: handleDeductResourcesChoice,
    component: "resource",
    numberOfOptions,
    modalPrompt: "Please select which resources you'd like to return:",
    resourceAmountsArr: optionsArr,
    error: "No resources to choose?",
  };
}

// function handleDeductResourcesChoice(
//   game,
//   player,
//   selectedResourceNamesArr,
//   onUpdateGame
// ) {
//   return new Promise((resolve) => {
//     game.gameLog.log.unshift({
//       player,
//       content: player.name + " selected " + selectedResourceNamesArr,
//     });
//     let resourceObjs = [];
//     let resourceAmounts = {orange: 1, black: 1, purple: 1, white: 1};
//     for (let i = 0; i < selectedResourceNamesArr.length; i++) {
//       let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
//       Object.keys(resourceObj).forEach((resourceName) => {
//         if (resourceName === selectedResourceNamesArr[i])
//           resourceObj[resourceName] = resourceAmounts[resourceName];
//       });
//       resourceObjs.push(resourceObj);
//     }
//     let totalSelectedResourceObj = combineSelectedResources(resourceObjs);
//     deductResources(game, player, totalSelectedResourceObj);
//     resolve(totalSelectedResourceObj);
//   });
// }

function createGetQuestImmediatelyCompleteChoiceObj(game) {
  return {
    optionsList: game.board.cliffwatchInn,
    // choiceLogicHelperFunction: handleGetQuestImmediatelyCompleteChoice,
    component: "quest",
    optionKey: "name",
    numberOfOptions: 1,
    modalPrompt:
      "Please select a Quest from Cliffwatch Inn. If you have enough resources, the selected Quest will immediately be completed and you will get an additional 4 points",
  };
}

// function handleGetQuestImmediatelyCompleteChoice(
//   game,
//   player,
//   selectedQuestNameArr,
//   onUpdateGame
// ) {
//   return new Promise((resolve) => {
//     for (let i = 0; i < game.board.cliffwatchInn.length; i++) {
//       let quest = game.board.cliffwatchInn[i];

//       if (quest.name.trim() === selectedQuestNameArr[0].trim()) {
//         let selectedQuest = quest;
//         getQuestFromCliffwatchInnAndMoveTo(
//           game,
//           i,
//           player.activeQuests,
//           player.name + " active quests"
//         );
//         if (
//           !player.activeQuests.find((quest) => quest.type === "MANDATORY QUEST")
//         ) {
//           if (enoughResources(player, selectedQuest.requires)) {
//             if (
//               confirm(
//                 "You have enough resources to immediately complete " +
//                   selectedQuest.name +
//                   ". Would you like to do so for an additional 4 points?"
//               )
//             ) {
//               completeQuest(game, player, selectedQuest, onUpdateGame);
//               game.gameLog.log.unshift({
//                 player,
//                 content:
//                   player.name +
//                   " gets an additional 4 points because they were able to immediately complete " +
//                   selectedQuest.name,
//               });
//               addPoints(game, player, 4);
//             }
//           }
//         } else {
//           game.gameLog.log.unshift({
//             player,
//             content:
//               player.name +
//               " cannot immedaitely complete " +
//               selectedQuest.name +
//               " because they have a Mandatory Quest",
//           });
//         }
//       }
//     }
//     resolve(game);
//   });
// }

// module.exports.handleResourcesChoice = handleResourcesChoice;
// module.exports.handleCliffwatchInnChoice = handleCliffwatchInnChoice;
// module.exports.handleCompleteQuestChoice = handleCompleteQuestChoice;
// module.exports.handleIntrigueChoice = handleIntrigueChoice;
// module.exports.handleBuyBuildingChoice = handleBuyBuildingChoice;
// module.exports.handleOtherPlayerChoice = handleOtherPlayerChoice;
// module.exports.handleGiveResourceForPointsChoice = handleGiveResourceForPointsChoice;
// module.exports.handleGiveResourceToAnotherPlayer = handleGiveResourceToAnotherPlayer;
// module.exports.handleGetFirstQuestOfQuestType = handleGetFirstQuestOfQuestType;
// module.exports.handleQuestForEachPlayer = handleQuestForEachPlayer;
// module.exports.handleGoOnBuildersHallSpot = handleGoOnBuildersHallSpot;
// module.exports.handleReturnToPool = handleReturnToPool;
// module.exports.handleWantToDiscardQuest = handleWantToDiscardQuest;
// module.exports.handleDiscardQuest = handleDiscardQuest;
// module.exports.handleDiscardBuilding = handleDiscardBuilding;
// module.exports.handleReplaceBuilding = handleReplaceBuilding;
// module.exports.handlePickPlayerAndRemoveCube = handlePickPlayerAndRemoveCube;
// module.exports.handleRemoveCube = handleRemoveCube;
// module.exports.handleUseOpponentSpot = handleUseOpponentSpot;
// module.exports.handleGetBuilding = handleGetBuilding;
// module.exports.handleWantToReplaceWithWhiteCube = handleWantToReplaceWithWhiteCube;
// module.exports.handleReplaceWithWhiteCube = handleReplaceWithWhiteCube;
// module.exports.handleDeductResourcesChoice = handleDeductResourcesChoice;
// module.exports.handleGetQuestImmediatelyCompleteChoice = handleGetQuestImmediatelyCompleteChoice;
