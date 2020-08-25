// import Resources from "./resources";
// const Resources = require("./resources");
const {quests, intrigues, lords} = require("./cards");
const {buildings} = require("./buildings");
const {spots} = require("../shared/boardSpots");
// const {choiceTypes} = require("./choiceLogic");
// const {makeChoiceNew} = require("./choiceLogic");

const resource = (module.exports.resource = function (
  orange,
  black,
  purple,
  white,
  gold,
  choice
) {
  return {orange, black, purple, white, gold, choice};
});

const resourceString = (module.exports.resourceString = function (resourceObj) {
  let text = "";
  text += resourceObj.orange ? resourceObj.orange + " Orange, " : "";
  text += resourceObj.black ? resourceObj.black + " Black, " : "";
  text += resourceObj.purple ? resourceObj.purple + " Purple, " : "";
  text += resourceObj.white ? resourceObj.white + " White, " : "";
  text += resourceObj.gold ? resourceObj.gold + " Gold, " : "";
  text = text.length > 0 ? text.substr(0, text.length - 2) : "No Resources";
  return text;
});

const addResources = (module.exports.addResources = function (
  resourceObj1,
  resourceObj2
) {
  let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
  Object.keys(resourceObj).forEach((resource) => {
    let resourceFrom1 = resourceObj1[resource];
    let resourceFrom2 = resourceObj2[resource];
    if (!resourceFrom1) resourceFrom1 = 0;
    if (!resourceFrom2) resourceFrom2 = 0;
    let combinedResourceNumber = resourceFrom1 + resourceFrom2;

    resourceObj[resource] = combinedResourceNumber;
  });
  return resourceObj;
});

const getResources = (module.exports.getResources = function (
  game,
  player,
  resourceObj,
  onUpdateGame,
  isReceivedResources
) {
  return new Promise((resolve) => {
    if (resourceObj.choice || resourceObj.length) {
      //either a choice cube or when resourceChoice - i.e. orange/black, white/purple x 2
      makeChoiceNew(
        game,
        choiceTypes.RESOURCE,
        player,
        onUpdateGame,
        resourceObj
      ).then((totalReceivedResources) => {
        if (isReceivedResources)
          checkSpecialResourcePlotQuests(
            game,
            player,
            totalReceivedResources,
            onUpdateGame
          );
        resolve(game);
      });
    } else {
      addResourcesForPlayer(game, player, resourceObj, {});
      if (isReceivedResources)
        checkSpecialResourcePlotQuests(game, player, resourceObj, onUpdateGame);
      resolve(game);
    }
  });
});

function checkSpecialResourcePlotQuests(
  game,
  player,
  resourceObj,
  onUpdateGame
) {
  if (player.on_receiving_purple_get_intrigue) {
    if (resourceObj.purple > 0) {
      game.gameLog.log.unshift({
        player,
        content:
          player.name +
          " completed EXPLORE AHGHAIRON'S TOWER, so they also receive an Intrigue",
      });
      addXIntrigues(game, player, 1);
    }
  }
  if (player.on_receiving_gold_get_blackCube) {
    if (resourceObj.gold > 0) {
      game.gameLog.log.unshift({
        player,
        content:
          player.name +
          " completed BRIBE THE SHIPWRIGHTS, so they also receive a Black Cube",
      });
      addResourcesForPlayer(game, player, {black: 1}, {});
    }
  }
  if (player.replace_cube_with_white_cube) {
    if (
      player.resources.orange > 0 ||
      player.resources.black > 0 ||
      player.resources.purple > 0
    ) {
      makeChoiceNew(
        game,
        choiceTypes.WANT_TO_REPLACE_CUBE_WITH_WHITE_CUBE,
        player,
        onUpdateGame
      );
    }
  }
  if (player.on_receiving_black_get_two_gold) {
    if (resourceObj.black > 0) {
      game.gameLog.log.unshift({
        player,
        content:
          player.name +
          " completed FENCE GOODS FOR DUKE OF DARKNESS, so they also receive two Gold",
      });
      addResourcesForPlayer(game, player, {gold: 2}, {});
    }
  }
  if (player.on_receiving_orange_get_orangeCube) {
    if (resourceObj.orange > 0) {
      game.gameLog.log.unshift({
        player,
        content:
          player.name +
          " completed BOLSTER GRIFFON CAVALRY, so they also receive an additional Orange Cube",
      });
      addResourcesForPlayer(game, player, {orange: 1}, {});
    }
  }
}

const addResourcesForPlayer = (module.exports.addResourcesForPlayer = function (
  game,
  player,
  resourceObj,
  totalSelectedResourceObj
) {
  player.resources = addResources(player.resources, totalSelectedResourceObj);
  player.resources = addResources(player.resources, resourceObj);
  let totalReceivedResources = addResources(
    resourceObj,
    totalSelectedResourceObj
  );
  game.gameLog.log.unshift({
    player,
    content:
      player.name + " received " + resourceString(totalReceivedResources),
  });
  return totalReceivedResources;
});

const enoughResources = (module.exports.enoughResources = function (
  player,
  requiresObj
) {
  let resourceObj = requiresObj.resources;
  if (resourceObj) {
    if (player.resources.orange < resourceObj.orange) return false;
    if (player.resources.black < resourceObj.black) return false;
    if (player.resources.purple < resourceObj.purple) return false;
    if (player.resources.white < resourceObj.white) return false;
    if (player.resources.gold < resourceObj.gold) return false;
    if (resourceObj.choice) {
      let numOfRequiredCubes = resourceObj.choice;
      if (
        player.resources.orange +
          player.resources.black +
          player.resources.purple +
          player.resources.white <
        numOfRequiredCubes
      )
        return false;
    }
  }
  let requiredPieces = requiresObj.pieces;
  if (requiredPieces) {
    if (player.piecesLeftForRound < requiredPieces) return false;
  }
  let requiredQuests = requiresObj.quests;
  if (requiredQuests) {
    if (player.activeQuests.length < requiredQuests) return false;
  }
  let requireControlledBuildingsWithNoPieces =
    requiresObj.buildingYouControlWithNoPiecesOnIt;
  if (requireControlledBuildingsWithNoPieces) {
    if (
      buildingsThatPlayerCanDiscard(player).length <
      requireControlledBuildingsWithNoPieces
    )
      return false;
  }
  return true;
});

const deductResources = (module.exports.deductResources = function (
  game,
  player,
  resourceObj,
  onUpdateGame
) {
  let text;
  if (enoughResources(player, {resources: resourceObj})) {
    //if trying to deduct choice resource, then choose resources and re-do deduct resources with selected resources
    if (resourceObj.choice) {
      makeChoiceNew(
        game,
        choiceTypes.DEDUCT_RESOURCES,
        player,
        onUpdateGame,
        resourceObj
      );
      return;
    }
    text = "Deducting: ";
    if (resourceObj.orange) player.resources.orange -= resourceObj.orange;
    if (resourceObj.black) player.resources.black -= resourceObj.black;
    if (resourceObj.purple) player.resources.purple -= resourceObj.purple;
    if (resourceObj.white) player.resources.white -= resourceObj.white;
    if (resourceObj.gold) player.resources.gold -= resourceObj.gold;

    text += resourceString(resourceObj);

    text += " from " + player.name;
    game.gameLog.log.unshift({player, content: text});
  } else {
    throw new Error("Player doesn't have enough resources to deduct...");
  }
});

const buildingsFromBuildersHallThatPlayerCanGoOn = (module.exports.buildingsFromBuildersHallThatPlayerCanGoOn = function (
  game,
  player
) {
  return game.board.buildersHall.filter((building) => {
    let spotEmpty = isSpotEmpty(building);
    let haveEnoughResources = true;
    if (building.requires)
      haveEnoughResources = enoughResources(player, building.requires);
    return spotEmpty && haveEnoughResources;
  });
});

const buildingsThatPlayerCanDiscard = (module.exports.buildingsThatPlayerCanDiscard = function (
  player
) {
  let buildingsThatPlayerCanDiscardArr = [];
  player.buildingsOwned.forEach((building) => {
    if (building.peopleOnSpot.length === 0)
      buildingsThatPlayerCanDiscardArr.push(building);
  });
  return buildingsThatPlayerCanDiscardArr;
});

const buildingsThatPlayerCanBuy = (module.exports.buildingsThatPlayerCanBuy = function (
  game,
  player
) {
  let buildingsThatPlayerCanBuyArr = game.board.buildersHall.filter(
    (building) => {
      let resourceObjForBuildingCost = {
        gold: building.cost,
      };
      return enoughResources(player, {resources: resourceObjForBuildingCost});
    }
  );
  return buildingsThatPlayerCanBuyArr;
});

function getBuildingFromStackAndPutIntoPlay(game, player) {
  let building = buildingFromTopOfPile(game);
  getBuilding(game, player, building);
  //move building from buildersHall to buildingsInPlay
  //first index of a number (non-building) in buildingsInPlay
  let buildingsInPlayindexToReplace = game.board.buildingsInPlay.indexOf(
    game.board.buildingsInPlay.find((building) => typeof building === "number")
  );
  game.board.buildingsInPlay[buildingsInPlayindexToReplace] = building;
  game.gameLog.log.unshift({
    content:
      player.name +
      " now owns " +
      building.name +
      " located at BuildingsInPlay spot " +
      (buildingsInPlayindexToReplace + 1),
    player,
  });
}

//grabs selected index building from BuildersHall.
//adds it to first non-building spot in BuildingsInPlay list,
//also replaces spot of old building in builders hall with a new building from top of the stack
const getBuildingFromBuildersHallAndMoveToBuildingsInPlay = (module.exports.getBuildingFromBuildersHallAndMoveToBuildingsInPlay = function (
  game,
  player,
  indexInBuildersHall,
  wantToBuyBuilding
) {
  let building = game.board.buildersHall[indexInBuildersHall];

  if (wantToBuyBuilding) buyBuilding(game, player, building);
  else getBuilding(game, player, building);

  //move building from buildersHall to buildingsInPlay
  //first index of a number (non-building) in buildingsInPlay
  let buildingsInPlayindexToReplace = game.board.buildingsInPlay.indexOf(
    game.board.buildingsInPlay.find((building) => typeof building === "number")
  );
  game.board.buildingsInPlay[buildingsInPlayindexToReplace] = building;
  game.gameLog.log.unshift({
    content:
      player.name +
      " now owns " +
      building.name +
      " located at BuildingsInPlay spot " +
      (buildingsInPlayindexToReplace + 1),
    player,
  });
  //check to see if need to add resources to building (and if need to add resources to goldBuilding)
  addRecurringResourcesToBuilding(game, building);

  //replce spot in buildersHall with new building
  const newBuilding = buildingFromTopOfPile(game);
  game.board.buildersHall[indexInBuildersHall] = newBuilding;
  game.gameLog.log.unshift({
    content:
      "New Building at spot " +
      (indexInBuildersHall + 1) +
      " of Builders Hall - " +
      newBuilding.name,
  });
});

//purchase building and set ownership
function buyBuilding(game, player, building) {
  let resourceObjForBuildingCost = {
    orange: 0,
    black: 0,
    purple: 0,
    white: 0,
    gold: building.cost,
  };
  //purchase the building
  deductResources(game, player, resourceObjForBuildingCost);
  //check to see if they have bonus for buying a building
  if (player.buy_building_bonus) {
    game.gameLog.log.unshift({
      player,
      content:
        player.name +
        " has completed INFILTRATE BUILDER'S HALL, so they receive " +
        player.buy_building_bonus +
        " points for buying a building",
    });
    addPoints(game, player, player.buy_building_bonus);
  }

  //set owner/inPlay and add points for owning building
  getBuilding(game, player, building);
}

//set owner/inPlay and add points for owning building
function getBuilding(game, player, building) {
  player.buildingsOwned.push(building);
  building.ownerID = player.id;
  building.inPlay = true;
  if (building.gems > 0) addPoints(game, player, building.gems);
}

//if building has special.type when_purchased_and_start_of_round. If not, then does nothing
function addRecurringResourcesToBuilding(game, building) {
  if (building.spotReward.special) {
    if (
      building.spotReward.special.type === "when_purchased_and_start_of_round"
    ) {
      if (building.spotReward.special.objectToAdd.points) {
        if (building.spotReward.hasOwnProperty("points")) {
          building.spotReward.points +=
            building.spotReward.special.objectToAdd.points;
        } else {
          building.spotReward.points =
            building.spotReward.special.objectToAdd.points;
        }
        game.gameLog.log.unshift({
          content:
            "Adding " +
            building.spotReward.special.objectToAdd.points +
            " points to " +
            building.name,
        });
      }
      if (building.spotReward.special.objectToAdd.resources) {
        if (building.spotReward.hasOwnProperty("resources")) {
          building.spotReward.resources = addResources(
            building.spotReward.resources,
            building.spotReward.special.objectToAdd.resources
          );
        } else {
          building.spotReward.resources =
            building.spotReward.special.objectToAdd.resources;
        }
        game.gameLog.log.unshift({
          content:
            "Adding " +
            resourceString(building.spotReward.special.objectToAdd.resources) +
            " to " +
            building.name,
        });
      }
    }
  }
  //then check to see if "gold_for_each_building_in_play" Building is on the board and if so need to update because potentially another building was added
  let goldBuilding;
  let numBuildingsInPlay = 0;
  game.board.buildingsInPlay.forEach((spot) => {
    if (typeof spot !== "number") {
      numBuildingsInPlay++;
      if (spot.spotReward.special) {
        if (spot.spotReward.special.type === "gold_for_each_building_in_play")
          goldBuilding = spot;
      }
    }
  });
  if (goldBuilding) {
    goldBuilding.spotReward.resources = {gold: numBuildingsInPlay};
  }
}

const activeQuestsThatPlayerCanComplete = (module.exports.activeQuestsThatPlayerCanComplete = function (
  player
) {
  if (player.activeQuests.find((quest) => quest.type === "MANDATORY QUEST")) {
    return player.activeQuests.filter(
      (quest) =>
        quest.type === "MANDATORY QUEST" &&
        enoughResources(player, quest.requires)
    );
  } else {
    return player.activeQuests.filter((quest) =>
      enoughResources(player, quest.requires)
    );
  }
});

const removeItemFromList = (module.exports.removeItemFromList = function (
  list,
  itemLookingFor
) {
  let index;
  for (let i = 0; i < list.length; i++) {
    if (list[i].key) {
      if (list[i].key === itemLookingFor.key) index = i;
    } else {
      if (list[i].name === itemLookingFor.name) index = i;
    }
  }
  list.splice(index, 1); //remove the played intrigue from player's hand
});

// return promise
const completeQuest = (module.exports.completeQuest = function (
  game,
  player,
  quest,
  onUpdateGame
) {
  return new Promise((resolve) => {
    game.gameLog.log.unshift({
      player,
      content: player.name + " Completing Quest: " + quest.name,
    });
    deductResources(game, player, quest.requires.resources);
    getAllRewards(quest.reward, game, player, onUpdateGame);
    //check to see if player has completed special quest that gives bonus points for competedQuest Type
    let bonusQuestForCompletedQuestType = player.completedQuests.find((q) => {
      if (q.reward.special)
        return q.reward.special.questBonusType === quest.type;
    });
    if (bonusQuestForCompletedQuestType) {
      game.gameLog.log.unshift({
        player,
        content:
          player.name +
          " has completed " +
          bonusQuestForCompletedQuestType.name +
          ", so they get an extra " +
          bonusQuestForCompletedQuestType.reward.special.questBonusPoints +
          " points for completing a " +
          bonusQuestForCompletedQuestType.reward.special.questBonusType +
          " Quest",
      });
      addPoints(
        game,
        player,
        bonusQuestForCompletedQuestType.reward.special.questBonusPoints
      );
    }

    player.completedQuests.push(quest);
    removeItemFromList(player.activeQuests, quest);
    player.alreadyCompletedQuestThisTurn = true;
    resolve(game);
  });
});

//add paramter for choice of players ->
const playIntrigue = (module.exports.playIntrigue = function (
  game,
  player,
  intrigue,
  onUpdateGame
) {
  return new Promise((resolve) => {
    if (player.two_points_when_you_play_intrigue) {
      game.gameLog.log.unshift({
        player,
        content:
          player.name +
          "completed PLACE A SLEEPER AGENT IN SKULLPORT, so they get 2 points for playing an Intrigue",
      });
      addPoints(game, player, 2);
    }
    if (intrigue.type === "MANDATORY QUEST") {
      makeChoiceNew(
        game,
        choiceTypes.PICK_ANOTHER_PLAYER,
        player,
        onUpdateGame,
        intrigue
      ).then((selectedPlayer) => {
        game.gameLog.log.unshift({
          player,
          content:
            player.name +
            " gave Mandatory Quest (" +
            intrigue.name +
            ") to " +
            selectedPlayer.name,
        });
        selectedPlayer.activeQuests.unshift(intrigue);
        resolve(game);
      });
    } else {
      game.gameLog.log.unshift({
        content: player.name + " played " + intrigue.name,
        player,
      });
      if (intrigue.reward) {
        game.intriguesDiscardPile.push(intrigue);
        getAllRewards(intrigue.reward, game, player, onUpdateGame).then(
          (returnedGame) => {
            resolve(returnedGame);
          }
        );
      } else {
        console.log("shoudlnt be here playIntrigue");
        resolve(game);
      }
    }
    removeItemFromList(player.intrigues, intrigue);
    // resolve(game);
  });
});

const intriguesThatPlayerCanPlay = (module.exports.intriguesThatPlayerCanPlay = function (
  player,
  game
) {
  let nonMandatoryIntrigues = player.intrigues.filter(
    (intrigue) => intrigue.type !== "MANDATORY QUEST"
  );
  //of the nonMandatory intriuges, check which ones have a requires and check to see if have enough resources (i.e. 2 gold, person in playerPool)
  let intriguesThatYouCannotPlay = nonMandatoryIntrigues.filter((intrigue) => {
    if (intrigue.requires) {
      //note - enough resources checks most potential requirements
      if (!enoughResources(player, intrigue.requires)) return true;
      if (intrigue.requires.spotsByOtherPeople) {
        let spotsByOtherPeople = 0;
        otherPlayers(game, player).forEach((player) => {
          spotsByOtherPeople += player.spotsPlayedThisRound.length;
        });
        //if other players have gone on less spots then the require - this isn't an intrigue you can play
        if (spotsByOtherPeople < intrigue.requires.spotsByOtherPeople)
          return true;
      }
    }
    if (intrigue.name === "FREE DRINKS!") {
      if (
        listOfPlayersThatHaveAtleastOneResourceCube(otherPlayers(game, player))
          .length === 0
      )
        return true;
    }
    return false;
  });
  let intriguesThatYouCanPlay = player.intrigues.filter(
    (intrigue) => !intriguesThatYouCannotPlay.includes(intrigue)
  );
  return intriguesThatYouCanPlay;
});

const isSpotsLeftToBuyBuildings = (module.exports.isSpotsLeftToBuyBuildings = function (
  game
) {
  let found = game.board.buildingsInPlay.find((building) => {
    return typeof building === "number";
  });
  return found ? true : false;
});

const listOfPlayersThatHaveAtleastOneResourceCube = (module.exports.listOfPlayersThatHaveAtleastOneResourceCube = function (
  listOfPlayers
) {
  let listOfPlayersWithAtleastOneResourceCube = [];
  listOfPlayers.forEach((player) => {
    if (
      player.resources.orange >= 1 ||
      player.resources.black >= 1 ||
      player.resources.purple >= 1 ||
      player.resources.white >= 1
    )
      listOfPlayersWithAtleastOneResourceCube.push(player);
  });
  return listOfPlayersWithAtleastOneResourceCube;
});

const playerMoveToDo = (module.exports.playerMoveToDo = function (player) {
  return player.moveToDo.length ? true : false;
});

function spotsOpponentsHaveGoneOnThisRound(game, player) {
  let spots_opp_have_gone_on_this_round = [];
  otherPlayers(game, player).forEach((player) => {
    player.spotsPlayedThisRound.forEach((spot) => {
      spots_opp_have_gone_on_this_round.push(spot);
    });
  });
  //get rid of potential duplicate spots (in case recover_the_magister_orb or zoarstar)
  spots_opp_have_gone_on_this_round = spots_opp_have_gone_on_this_round.filter(
    (spot, i) => spots_opp_have_gone_on_this_round.indexOf(spot) === i
  );
  return spots_opp_have_gone_on_this_round;
}

module.exports.isASpotOnBoardAvailable = function (game, currPlayer) {
  let isASpotAvailable = false;
  game.board.spots.forEach((spot) => {
    if (isSpotAvailable(game, currPlayer, spot)) {
      isASpotAvailable = true;
      return;
    }
  });
  if (isASpotAvailable) return true;
  game.board.buildingsInPlay.forEach((building) => {
    if (building.inPlay === true)
      if (isSpotAvailable(game, currPlayer, building)) isASpotAvailable = true;
  });
  return isASpotAvailable;
};

const isSpotAvailable = (module.exports.isSpotAvailable = function (
  game,
  currPlayer,
  spot
) {
  if (playerMoveToDo(currPlayer)) {
    if (spot.group === "WATERDEEP HARBOR") {
      if (game.inPostRound) return false;
      else {
        if (spot.number === lowestNumberAvailableSpotInWaterdeepHarbor(game))
          return true;
        else return false;
      }
    }
    if (spot.name === "BUILDER'S HALL") {
      if (!isSpotsLeftToBuyBuildings(game)) return false;
    }
    if (spot.inPlay === false) return false;
    if (isSpotEmpty(spot)) return true;
    else {
      if (currPlayer.recover_magisters_orb) return true;
    }
  }
  return false;
});

function isSpotEmpty(spot) {
  if (spot.peopleOnSpot.length === 0) return true;
  return false;
}

const isSelectedPlayerGameCurrPlayer = (module.exports.isSelectedPlayerGameCurrPlayer = function (
  selectedPlayer,
  currPlayer
) {
  if (selectedPlayer) {
    if (selectedPlayer.name === currPlayer.name) return true;
  }
  return false;
});

const playersWithNonEmptyChoiceQueue = (module.exports.playersWithNonEmptyChoiceQueue = function (
  game
) {
  let playersWithNonEmptyChoiceQueuesArray = [];
  game.players.forEach((player) => {
    if (player.choiceQueue.length > 0)
      playersWithNonEmptyChoiceQueuesArray.push(player);
  });
  return playersWithNonEmptyChoiceQueuesArray;
});

module.exports.highlightAvailableSpot = function (
  game,
  spot,
  selectedPlayer,
  currPlayer
) {
  return (
    isSelectedPlayerGameCurrPlayer(selectedPlayer, currPlayer) &&
    playersWithNonEmptyChoiceQueue(game).length === 0 &&
    isSpotAvailable(game, currPlayer, spot) &&
    playerMoveToDo(currPlayer)
  );
};

function lowestNumberAvailableSpotInWaterdeepHarbor(game) {
  //find lowest number for WDH where there are no people on a spot
  let waterdeepHarborSpots = game.board.spots.filter(
    (spot) => spot.group === "WATERDEEP HARBOR"
  );
  for (let i = 0; i < waterdeepHarborSpots.length; i++) {
    if (isSpotEmpty(waterdeepHarborSpots[i])) return i + 1;
  }
  return 0;
}

function playerMoveOnSpot(game, player, spot) {
  spot.peopleOnSpot.push(player.id);
  //only chance that there would be 2 people on 1 spot is if special recover_magisters_orb was used (rare case could be because of zoarstar on intrigues)
  if (spot.peopleOnSpot.length > 1) {
    if (player.hasOwnProperty("recover_magisters_orb"))
      player.recover_magisters_orb = false;
  }
  player.spotsPlayedThisRound.push(spot);
  player.piecesLeftForRound--;
  player.moveToDo.pop();
  let spotName = spot.name ? spot.name : spot.shortName;
  let ownedBy;
  spot.hasOwnProperty("ownerID") && spot.ownerID !== ""
    ? (ownedBy = ". (owned by " + game.players[spot.ownerID].name + ")")
    : (ownedBy = "");
  game.gameLog.log.unshift({
    content: player.name + " went on " + spotName + ownedBy,
    player,
  });
}

const unDoPlayerMoveOnSpot = (module.exports.unDoPlayerMoveOnSpot = function (
  game,
  player,
  spot
) {
  //undo spot.peopleOnSpot.push(player);
  spot.peopleOnSpot.splice(spot.peopleOnSpot.indexOf(player.id), 1);
  // undo player.spotsPlayedThisRound.push(spot);
  player.spotsPlayedThisRound.splice(
    player.spotsPlayedThisRound.indexOf(spot),
    1
  );
  // // undo spot.color = player.color;
  // spot.color = "";
  // undo player.piecesLeftForRound--;
  player.piecesLeftForRound++;

  let spotName = spot.name ? spot.name : spot.shortName;
  game.gameLog.log.unshift({
    content: player.name + " took away Piece from " + spotName,
    player,
  });
});

function getAllRewards(spotRewardObj, game, playerToGetRewards, onUpdateGame) {
  return new Promise((resolve) => {
    getNonSpecialRewards(
      spotRewardObj,
      game,
      playerToGetRewards,
      onUpdateGame
    ).then((returnedGame) => {
      if (spotRewardObj.special) {
        handleAllSpecial(
          spotRewardObj.special,
          game,
          playerToGetRewards,
          onUpdateGame
        ).then((returnedGame2) => {
          resolve(returnedGame2);
        });
      } else {
        resolve(returnedGame);
      }
    });
  });
}

function getNonSpecialRewards(
  spotRewardObj,
  game,
  playerToGetRewards,
  onUpdateGame
) {
  return new Promise((resolve) => {
    let didResolve = false;
    const spotResources = spotRewardObj.resources;
    if (spotResources) {
      didResolve = true;
      let isReceivedResources =
        game.currPlayersTurn.name === playerToGetRewards.name;
      getResources(
        game,
        playerToGetRewards,
        spotResources,
        onUpdateGame,
        isReceivedResources
      ).then((returnedGame) => resolve(returnedGame));
    }
    const spotResourceChoice = spotRewardObj.resourceChoice;
    if (spotResourceChoice) {
      didResolve = true;
      let isReceivedResources =
        game.currPlayersTurn.name === playerToGetRewards.name;
      getResources(
        game,
        playerToGetRewards,
        spotResourceChoice,
        onUpdateGame,
        isReceivedResources
      ).then((returnedGame) => resolve(returnedGame));
    }
    if (spotRewardObj.resetQuests) {
      resetQuests(game);
    }
    const spotGetQuest = spotRewardObj.quests;
    if (spotGetQuest) {
      makeChoiceNew(
        game,
        choiceTypes.PICK_QUEST_FROM_CWI,
        playerToGetRewards,
        onUpdateGame
      );
    }
    if (spotRewardObj.castle) {
      game.players.forEach((p) => {
        p.ownCastle = false;
      });
      playerToGetRewards.ownCastle = true;
      game.gameLog.log.unshift({
        player: playerToGetRewards,
        content: playerToGetRewards.name + " owns the Castle",
      });
    }
    const spotGetIntrigues = spotRewardObj.intrigues;
    if (spotGetIntrigues) {
      addXIntrigues(game, playerToGetRewards, spotGetIntrigues);
    }
    if (spotRewardObj.buyBuilding) {
      makeChoiceNew(
        game,
        choiceTypes.BUY_BUILDING,
        playerToGetRewards,
        onUpdateGame
      );
    }
    if (spotRewardObj.playIntrigue) {
      didResolve = true;
      makeChoiceNew(
        game,
        choiceTypes.PLAY_INTRIGUE,
        playerToGetRewards,
        onUpdateGame
      ).then((returnedGame) => resolve(returnedGame));
    }
    if (spotRewardObj.points) {
      addPoints(game, playerToGetRewards, spotRewardObj.points);
    }
    if (!didResolve) resolve(game);
  });
}

const otherPlayers = (module.exports.otherPlayers = function (
  game,
  currPlayer
) {
  let otherPlayers = [];
  game.players.forEach((player) => {
    if (player.name !== currPlayer.name) otherPlayers.push(player);
  });
  return otherPlayers;
});

function handleAllSpecial(
  special,
  game,
  playerThatCalledSpecialReward,
  onUpdateGame
) {
  return new Promise((resolve) => {
    let needToResolve = false;
    if (special.type === "Each opponent choice to give resource for points") {
      otherPlayers(game, playerThatCalledSpecialReward).forEach((player) => {
        if (enoughResources(player, special)) {
          makeChoiceNew(
            game,
            choiceTypes.GIVE_RESOURCE_FOR_POINTS,
            player,
            onUpdateGame,
            special,
            playerThatCalledSpecialReward
          ).then((returnedGame) => resolve(returnedGame));
        }
      });
    } else if (special.type === "Give resource to another player") {
      makeChoiceNew(
        game,
        choiceTypes.GIVE_RESOURCE_TO_PLAYER,
        playerThatCalledSpecialReward,
        onUpdateGame,
        special.resources
      ).then((returnedGame) => resolve(returnedGame));
    } else if (special.type === "Choose_Quest_Type") {
      makeChoiceNew(
        game,
        choiceTypes.QUEST_TYPE,
        playerThatCalledSpecialReward,
        onUpdateGame
      ).then(resolve(game));
    } else if (special.type === "draw_quest_for_all_players") {
      let numOfPlayers = game.players.length;

      makeChoiceNew(
        game,
        choiceTypes.DRAW_QUEST_FOR_ALL_PLAYERS,
        playerThatCalledSpecialReward,
        onUpdateGame,
        getXQuestsFromTopOfDeck(game, numOfPlayers)
      ).then(() => {
        resolve(game);
      });
    } else if (special.type === "go_on_buildersHall_spot") {
      makeChoiceNew(
        game,
        choiceTypes.GO_ON_A_BUILDERS_HALL_SPOT,
        playerThatCalledSpecialReward,
        onUpdateGame
      ).then(resolve(game));
    } else if (special.type === "return_1_to_pool") {
      makeChoiceNew(
        game,
        choiceTypes.RETURN_1_TO_POOL,
        playerThatCalledSpecialReward,
        onUpdateGame,
        playerThatCalledSpecialReward.spotsPlayedThisRound
      ).then(resolve(game));
    } else if (special.type === "resource_to_all_players") {
      otherPlayers(game, playerThatCalledSpecialReward).forEach((player) => {
        getResources(
          game,
          player,
          special.resources,
          onUpdateGame,
          false
        ).then((returnedGame) => resolve(returnedGame));
      });
    } else if (special.type === "choose_resource") {
      makeChoiceNew(
        game,
        choiceTypes.RESOURCE,
        playerThatCalledSpecialReward,
        onUpdateGame
      ).then(resolve(game));
    } else if (special.type === "return_piece_and_go_twice_in_a_row") {
      makeChoiceNew(
        game,
        choiceTypes.RETURN_1_TO_POOL,
        playerThatCalledSpecialReward,
        onUpdateGame,
        playerThatCalledSpecialReward.spotsPlayedThisRound.filter(
          (spot) => spot.group === "WATERDEEP HARBOR"
        )
      ).then(() => {
        game.gameLog.log.unshift({
          content: "Now immediately play 2 Pieces in a row",
          player: playerThatCalledSpecialReward,
        });
        resolve(game);
      });
      playerThatCalledSpecialReward.moveToDo.push(true);
      playerThatCalledSpecialReward.moveToDo.push(true);
    } else if (special.type === "discard_quest") {
      game.players.forEach((player) => {
        if (enoughResources(player, special))
          makeChoiceNew(
            game,
            choiceTypes.WANT_TO_DISCARD_QUEST,
            player,
            onUpdateGame,
            special,
            playerThatCalledSpecialReward
          ).then((returnedGame) => resolve(returnedGame));
      });
    } else if (special.type === "discard_building") {
      //discard building which calls another makeChoice that will replace building
      makeChoiceNew(
        game,
        choiceTypes.DISCARD_BUILDING,
        playerThatCalledSpecialReward,
        onUpdateGame
      ).then((returnedGame) => resolve(returnedGame));
    } else if (special.type === "each_opp_remove_cube") {
      otherPlayers(game, playerThatCalledSpecialReward).forEach((player) => {
        try {
          deductResources(game, player, special.resources);
        } catch {
          game.gameLog.log.unshift({
            player: playerThatCalledSpecialReward,
            content:
              player.name + " didn't have " + resourceString(special.resources),
          });
          getAllRewards(
            special.rewardIfDontHave,
            game,
            playerThatCalledSpecialReward
          );
        }
      });
      resolve(game);
    } else if (special.type === "remove_cube_of_choice") {
      makeChoiceNew(
        game,
        choiceTypes.PICK_PLAYER_AND_REMOVE_CUBE_OF_CHOICE,
        playerThatCalledSpecialReward,
        onUpdateGame
      ).then((returnedGame) => resolve(returnedGame));
    } else if (special.type === "go_on_opponent_spot") {
      deductResources(game, playerThatCalledSpecialReward, {gold: 2});

      makeChoiceNew(
        game,
        choiceTypes.GO_ON_OPPONENT_SPOT,
        playerThatCalledSpecialReward,
        onUpdateGame,
        spotsOpponentsHaveGoneOnThisRound(game, playerThatCalledSpecialReward)
      ).then((returnedGame) => resolve(returnedGame));
    } else if (special.type === "recover_magisters_orb") {
      playerThatCalledSpecialReward.recover_magisters_orb = true;
      needToResolve = true;
    } else if (special.type === "on_receiving_purple_get_intrigue") {
      playerThatCalledSpecialReward.on_receiving_purple_get_intrigue = true;
      needToResolve = true;
    } else if (special.type === "get_building_from_BH") {
      if (isSpotsLeftToBuyBuildings(game)) {
        game.gameLog.log.unshift({
          player: playerThatCalledSpecialReward,
          content:
            playerThatCalledSpecialReward.name +
            " completed LURE ARTISANS OF MIRABAR, so they get to put 1 Building from Builder's Hall into play under their control at no cost",
        });

        makeChoiceNew(
          game,
          choiceTypes.GET_BUILDING_FROM_BH,
          playerThatCalledSpecialReward,
          onUpdateGame
        ).then((returnedGame) => resolve(returnedGame));
      }
    } else if (special.type === "get_building_from_stack") {
      if (isSpotsLeftToBuyBuildings(game)) {
        game.gameLog.log.unshift({
          player: playerThatCalledSpecialReward,
          content:
            playerThatCalledSpecialReward.name +
            " completed PLACATE THE WALKING STATUE, so they get to draw 1 Building from the stack and put it into play under their control at no cost",
        });
        getBuildingFromStackAndPutIntoPlay(game, playerThatCalledSpecialReward);
      }
      needToResolve = true;
    } else if (special.type === "get_quest_from_deck") {
      game.gameLog.log.unshift({
        player: playerThatCalledSpecialReward,
        content:
          playerThatCalledSpecialReward.name +
          " completed LOOT THE CRYPT OF CHAUNTEA, so they get to draw a Quest from the deck",
      });
      addQuest(
        game,
        questFromTopOfDeck(game),
        playerThatCalledSpecialReward.activeQuests,
        playerThatCalledSpecialReward.name + "'s active quests"
      );
      needToResolve = true;
    } else if (special.type === "buy_building_bonus") {
      playerThatCalledSpecialReward.buy_building_bonus =
        special.buyBuildingBonusPoints;
      needToResolve = true;
    } else if (special.type === "on_receiving_gold_get_blackCube") {
      playerThatCalledSpecialReward.on_receiving_gold_get_blackCube = true;
      needToResolve = true;
    } else if (special.type === "replace_cube_with_white_cube") {
      playerThatCalledSpecialReward.replace_cube_with_white_cube = true;
      needToResolve = true;
    } else if (special.type === "start_round_get_cube_of_choice") {
      playerThatCalledSpecialReward.start_round_get_cube_of_choice = true;
      needToResolve = true;
    } else if (special.type === "two_points_for_each_building_controlled") {
      let numOfBuildingsControlled = 0;
      game.board.buildingsInPlay.forEach((building) => {
        let buildingOwner = game.players[building.ownerID];
        if (buildingOwner) {
          if (buildingOwner.name === playerThatCalledSpecialReward.name)
            numOfBuildingsControlled++;
        }
      });
      game.gameLog.log.unshift({
        player: playerThatCalledSpecialReward,
        content:
          playerThatCalledSpecialReward.name +
          " completed ESTABLISH HARPERS SAFE HOUSE, so they get an additional 2 points for every building they control (" +
          numOfBuildingsControlled +
          " buildings)",
      });
      if (numOfBuildingsControlled > 0)
        addPoints(
          game,
          playerThatCalledSpecialReward,
          2 * numOfBuildingsControlled
        );
      else
        game.gameLog.log.unshift({
          player: playerThatCalledSpecialReward,
          content:
            playerThatCalledSpecialReward.name +
            " doesn't control any buildings",
        });
      needToResolve = true;
    } else if (special.type === "two_points_when_you_play_intrigue") {
      playerThatCalledSpecialReward.two_points_when_you_play_intrigue = true;
      needToResolve = true;
    } else if (special.type === "on_receiving_black_get_two_gold") {
      playerThatCalledSpecialReward.on_receiving_black_get_two_gold = true;
      needToResolve = true;
    } else if (special.type === "play_intrigue") {
      game.gameLog.log.unshift({
        player: playerThatCalledSpecialReward,
        content:
          playerThatCalledSpecialReward.name +
          " completed PRISON BREAK, so they get to immediately play an Intrigue",
      });

      makeChoiceNew(
        game,
        choiceTypes.PLAY_INTRIGUE,
        playerThatCalledSpecialReward,
        onUpdateGame
      ).then((returnedGame) => resolve(returnedGame));
    } else if (special.type === "on_receiving_orange_get_orangeCube") {
      playerThatCalledSpecialReward.on_receiving_orange_get_orangeCube = true;
      needToResolve = true;
    } else if (special.type === "own_lieutenant") {
      game.gameLog.log.unshift({
        player: playerThatCalledSpecialReward,
        content:
          playerThatCalledSpecialReward.name +
          " completed RECRUIT LIEUTENANT, so the Lieutenant has been added to their pool for the rest of the game",
      });
      playerThatCalledSpecialReward.piecesLeftForRound += 1;
      playerThatCalledSpecialReward.ownLieutenant = true;
      needToResolve = true;
    } else if (special.type === "own_ambassador") {
      //set all players ownAmbassador to false (in case someone else went on the spot this round)
      game.players.forEach((player) => {
        player.ownAmbassador = false;
      });
      game.gameLog.log.unshift({
        player: playerThatCalledSpecialReward,
        content:
          playerThatCalledSpecialReward.name +
          " will get to assign the Ambassador at the beginning of the next round",
      });
      playerThatCalledSpecialReward.ownAmbassador = true;
      needToResolve = true;
    } else if (special.type === "get_quest_immediately_complete") {
      makeChoiceNew(
        game,
        choiceTypes.GET_QUEST_AND_IMMEDIATELY_COMPLETE,
        playerThatCalledSpecialReward,
        onUpdateGame
      ).then((returnedGame) => {
        resolve(returnedGame);
      });
    } else if (special.type === "gold_for_each_building_in_play") {
      //have other functions that change the spotReward resources
      needToResolve = true;
    } else if (special.type === "when_purchased_and_start_of_round") {
      //have other functions that change the spotReward resources
      needToResolve = true;
    } else if (special.type === "use_zoarstar") {
      playerThatCalledSpecialReward.use_zoarstar = true;

      makeChoiceNew(
        game,
        choiceTypes.GO_ON_OPPONENT_SPOT,
        playerThatCalledSpecialReward,
        onUpdateGame,
        spotsOpponentsHaveGoneOnThisRound(game, playerThatCalledSpecialReward)
      ).then((returnedGame) => resolve(returnedGame));
    } else {
    }
    if (needToResolve) resolve(game);
  });
}

function getOwnerReward(spot, game, onUpdateGame) {
  return new Promise((resolve) => {
    let didResolve = false;
    if (spot.ownerReward && spot.ownerID !== "") {
      if (game.currPlayersTurn.name !== game.players[spot.ownerID].name) {
        didResolve = true;
        getAllRewards(
          spot.ownerReward,
          game,
          game.players[spot.ownerID],
          onUpdateGame
        ).then((returnedGame) => {
          resolve(returnedGame);
        });
      }
    }
    //if no owner reward to give then just resolve the game that was used as parameter to function
    if (!didResolve) resolve(game);
  });
}

const spotPicked = (module.exports.spotPicked = function (
  game,
  currPlayer,
  spot,
  onUpdateGame
) {
  return new Promise((resolve) => {
    useActionSpace(game, currPlayer, spot, onUpdateGame, true).then(
      (returnedGame) => {
        resolve(returnedGame);
      }
    );
  });
});

const useActionSpace = (module.exports.useActionSpace = function (
  game,
  player,
  spot,
  onUpdateGame,
  allowPlayerGoOnSpot
) {
  return new Promise((resolve) => {
    let didResolve = false;
    if (
      !game.gameLog.log[0].player ||
      (game.gameLog.log[0].player &&
        game.gameLog.log[0].player.name !== game.currPlayersTurn.name)
    ) {
      //if previous gameLog has no player or there is a player and player is different than currPlayer
      game.gameLog.log.unshift({content: "", player: game.currPlayersTurn});
    }
    if (spot.spotRequires) {
      let didResolveForSpotRequires = false;
      try {
        deductResources(
          game,
          player,
          spot.spotRequires.resources,
          onUpdateGame
        );
      } catch {
        //dont have enough resources so special scenario here
        if (
          confirm(
            "You don't have enough resources to get the rewards, are you sure you want to go here?"
          )
        ) {
          // move on spot and owner gets ownerReward - but plater won't get spot rewards
          didResolveForSpotRequires = true;
          if (allowPlayerGoOnSpot) playerMoveOnSpot(game, player, spot);
          getOwnerReward(spot, game, onUpdateGame).then((returnedGame) => {
            resolve(returnedGame);
          });
        }
        //if wanted to cancel, then resolves the parameter game (which is how it was when we started the turn) - so bascially just acts like reDo move
        if (!didResolveForSpotRequires) {
          resolve(null);
        }
        return; //just quit out of spotPicked without doing any of below code
      }
    }
    //FUNCTION FOR ALL CHECKS TO MAKE SURE ELLIGIBLE MOVE
    if (reDoMoveOnPotentialBadSpot(game, player, spot)) {
      resolve(null);
      return;
    }

    if (allowPlayerGoOnSpot) playerMoveOnSpot(game, player, spot);
    let spotRewardObj = spot.spotReward;
    if (spotRewardObj) {
      didResolve = true;
      getAllRewards(spotRewardObj, game, player, onUpdateGame).then(
        (returnedGame) => {
          getOwnerReward(
            spot,
            returnedGame,
            onUpdateGame
          ).then((returnedGame2) => resolve(returnedGame2));
        }
      );
      if (spotRewardObj.special) {
        if (
          spotRewardObj.special.type === "when_purchased_and_start_of_round"
        ) {
          if (spot.spotReward.resources) spot.spotReward.resources = {};
          if (spot.spotReward.points) spot.spotReward.points = 0;
        }
      }
    } else {
      console.log("spot picked but Spot has no rewardObj???");
    }
    if (!didResolve) resolve(game);
  });
});

function reDoMoveOnPotentialBadSpot(game, player, spot) {
  if (spot.group === "WATERDEEP HARBOR") {
    //imitate like player has moved to see if there are intrigues they'll still be able to play
    player.piecesLeftForRound--;
    if (intriguesThatPlayerCanPlay(player, game).length === 0) {
      if (
        !confirm(
          "You can't play any intrigues, are you sure you would like to go here?"
        )
      ) {
        return true;
      }
    }
    player.piecesLeftForRound++;
  }
  if (spot.name === "BUILDER'S HALL") {
    if (buildingsThatPlayerCanBuy(game, player).length === 0) {
      if (
        !confirm(
          "You can't buy any buildings, are you sure you would like to go here?"
        )
      ) {
        return true;
      }
    }
  }
  const spotRewardObj = spot.spotReward;
  if (spotRewardObj) {
    //special case if trying to go on special building when there are no resources - give option to re-do
    if (spot.spotReward.resources) {
      if (Object.keys(spot.spotReward.resources).length === 0) {
        if (
          !confirm(
            "There are no resources to collect, are you sure you would like to go here?"
          )
        ) {
          return true;
        }
      }
    }
    if (spot.spotReward.hasOwnProperty("points")) {
      if (spot.spotReward.points === 0) {
        if (
          !confirm(
            "There are no points to score, are you sure you would like to go here?"
          )
        ) {
          return true;
        } else {
          game.gameLog.log.unshift({
            player,
            content: "There were no points to score " + spot.name,
          });
        }
      }
    }
    if (spot.spotReward.special) {
      if (spot.spotReward.special.type === "use_zoarstar") {
        if (spotsOpponentsHaveGoneOnThisRound(game, player).length === 0) {
          if (
            !confirm(
              "There are no spots that opponents have gone on this round, are you sure you would like to go here?"
            )
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function setCorrectOrder(game) {
  game.currPlayersTurn = null;

  //check to see if ambassador is in play
  game.players.forEach((p) => {
    if (p.ownAmbassador) {
      game.gameLog.log.unshift({
        player: p,
        content: "",
      });
      game.gameLog.log.unshift({
        player: p,
        content: p.name + " owns the Ambassador, so they get to go first",
      });
      game.currPlayersTurn = p;
      p.moveToDo.push(true);
      //we added the move to player, so now we can set ownAmbassador to false
      p.ownAmbassador = false;
    }
  });

  if (game.currPlayersTurn === null) {
    //no ambassador
    game.players.forEach((p) => {
      if (p.ownCastle) {
        game.currPlayersTurn = p;
        p.moveToDo.push(true);
      }
    });
    // game.nextPlayerTurn = playerAfterCurrPlayer(game, currPlayer);
  } else {
    //yes ambassador
    game.players.forEach((p) => {
      if (p.ownCastle) game.nextPlayerTurn = p;
    });
  }
}

//reset player's pieces, clear their spots played, and remove players from all spots
function clearOldRound(game) {
  game.players.forEach((player) => {
    player.spotsPlayedThisRound = [];
  });
  game.board.spots.forEach((spot) => {
    spot.peopleOnSpot = [];
  });
  game.board.buildingsInPlay.forEach((spot) => {
    if (typeof spot !== "number") spot.peopleOnSpot = [];
  });
}

function startNextRound(game, onUpdateGame) {
  clearOldRound(game);
  game.round++;
  if (game.round < 10) {
    game.gameLog.log.unshift({
      content: "Starting Round " + game.round,
    });
    game.inPostRound = false;
    preRoundSetUp(game, onUpdateGame);
    setCorrectOrder(game);
    // game.gameLog.log.unshift({content: "", player: game.currPlayersTurn});
  } else {
    game.playingGame = false;
  }
}

//changes game.currPlayersTurn to the new correct person (changes rounds if no more moves left in curr round)
module.exports.endPlayersTurn = function (
  game,
  player,
  wantToEndTurnPrematurely,
  onUpdateGame
) {
  let playerNumber = game.players.length;
  let playersWithNoMoreMoves = 0;
  let needToFindNextPlayer = true;
  while (needToFindNextPlayer) {
    const newNextPlayer = playerAfterCurrPlayer(game, player);
    if (!newNextPlayer) {
      //if playerAfterCurrPlayer doesn't return any players that have available moves, start next round
      needToFindNextPlayer = false;
      startNextRound(game, onUpdateGame);
    } else {
      if (newNextPlayer.piecesLeftForRound > 0) {
        if (wantToEndTurnPrematurely) game.currPlayersTurn.piecesLeftForRound--;
        // newNextPlayer.moveToDo = true;
        newNextPlayer.moveToDo.push(true);
        game.currPlayersTurn = newNextPlayer;
        needToFindNextPlayer = false;
      } else {
        playersWithNoMoreMoves++;
        player = newNextPlayer;
        if (playersWithNoMoreMoves === playerNumber) {
          game.inPostRound = true;
          game.gameLog.log.unshift({
            content: "Post Round " + game.round + " - Waterdeep Harbor Phase",
          });
        }
      }
    }
  }
};

function playerAfterCurrPlayer(game, currPlayer) {
  if (!game.inPostRound) {
    let currPlayerIndex = currPlayer.id;
    let nextPlayerIndex;
    if (game.nextPlayerTurn) {
      //this happens when ambassador is in play
      nextPlayerIndex = game.nextPlayerTurn.id;
      game.nextPlayerTurn = null;
    } else {
      nextPlayerIndex = (currPlayerIndex + 1) % game.players.length;
    }
    game.players[nextPlayerIndex].alreadyCompletedQuestThisTurn = false;
    return game.players[nextPlayerIndex];
  } else {
    let waterdeepHarborSpots = game.board.spots.filter(
      (spot) => spot.group === "WATERDEEP HARBOR"
    );
    let earliestSpotWithPlayerOnIt = waterdeepHarborSpots.find(
      (spot) => spot.peopleOnSpot.length > 0
    );
    if (earliestSpotWithPlayerOnIt) {
      let firstPlayerOnSpot =
        game.players[earliestSpotWithPlayerOnIt.peopleOnSpot.shift()]; //take away person from spot
      firstPlayerOnSpot.piecesLeftForRound++; //add count to player's moves for round
      firstPlayerOnSpot.alreadyCompletedQuestThisTurn = false;
      return firstPlayerOnSpot;
    } else {
      //if no more spots in WDH with a player on it, then dont return anyone (next round)
      return;
    }
  }
}

function preRoundSetUp(game, onUpdateGame) {
  //add gems to buildings
  game.board.buildersHall.forEach((building) => {
    building.gems++;
  });
  game.players.forEach((player) => {
    let numberOfPiecesPerRound = game.players.length <= 3 ? 4 : 3;
    player.piecesLeftForRound = numberOfPiecesPerRound;
    if (game.round >= 5) {
      if (game.round === 5)
        game.gameLog.log.unshift({
          content:
            "Starting Round " +
            game.round +
            " - Everyone gets an additional Person in their pools",
        });
      player.piecesLeftForRound += 1;
    }
    if (player.ownAmbassador) player.piecesLeftForRound += 1;
    if (player.ownLieutenant) player.piecesLeftForRound += 1;

    //per round specials
    if (player.hasOwnProperty("recover_magisters_orb"))
      player.recover_magisters_orb = true;
    if (player.hasOwnProperty("replace_cube_with_white_cube"))
      player.replace_cube_with_white_cube = true;
    if (game.round >= 2) {
      if (player.start_round_get_cube_of_choice) {
        game.gameLog.log.unshift({
          player,
          content:
            player.name +
            " completed DEFEND THE TOWER OF LUCK, so they get a resource of their choice to start the round",
        });
        getResources(game, player, {choice: 1}, onUpdateGame, true);
      }
    }
  });
  //check to add resources to buildings in play
  game.board.buildingsInPlay.forEach((spot) => {
    if (typeof spot !== "number") {
      let building = spot;
      //this isnt working
      addRecurringResourcesToBuilding(game, building);
    }
  });
}

//functions having to do with cards / setting up the board

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let rand = Math.floor(Math.random() * i);
    let temp = arr[i];
    arr[i] = arr[rand];
    arr[rand] = temp;
  }
}

function createPlayers(numPlayers) {
  const players = [];
  const colors = ["red", "blue", "darkgreen", "yellowgreen", "gray"];
  for (let i = 0; i < numPlayers; i++) {
    players.push({
      id: i,
      name: `Player ${i + 1}`,
      score: 0,
      resources: resource(0, 0, 0, 0, 4 + i),
      buildingsOwned: [],
      choiceQueue: [],
      piecesLeftForRound: 0,
      spotsPlayedThisRound: [],
      moveToDo: [],
      alreadyCompletedQuestThisTurn: false,
      activeQuests: [],
      completedQuests: [],
      intrigues: [],
      ownCastle: i === 0,
      ownAmbassador: false,
      ownLieutenant: false,
      color: colors[i],
    });
  }
  return players;
}

module.exports.createGame = function (gameId, numPlayers) {
  const questsDeck = quests.slice();
  shuffle(questsDeck);
  const intriguesDeck = intrigues.slice();
  shuffle(intriguesDeck);
  const buildingsStack = buildings.slice();
  shuffle(buildingsStack);
  const lordsDeck = lords.slice();
  shuffle(lordsDeck);

  const players = createPlayers(numPlayers);

  const game = {
    gameId,
    playingGame: true,
    currPlayersTurn: players[0],
    players,
    round: 0,
    inPostRound: false,
    board: {
      cliffwatchInn: [],
      buildersHall: [],
      spots,
      buildingsInPlay: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    questsDeck,
    questsDiscardPile: [],
    intriguesDeck,
    intriguesDiscardPile: [],
    buildingsStack,
    buildingsDiscardPile: [],
    lordsDeck,
    lastUpdated: Date.now(),
    gameLog: {
      log: [{player: "", content: "Pre-Game Set Up:"}],
      moveHistory: [],
    },
  };

  dealCardsToPlayers(game);
  setupCliffwatchInnAndBuildersHall(game);
  startNextRound(game);

  return game;
};

function dealCardsToPlayers(game) {
  game.players.forEach((player) => {
    addQuest(
      game,
      questFromTopOfDeck(game),
      player.activeQuests,
      player.name + "'s active quests"
    );
    addQuest(
      game,
      questFromTopOfDeck(game),
      player.activeQuests,
      player.name + "'s active quests"
    );
    addXIntrigues(game, player, 2);
    addLord(game, player);
  });
}

function setupCliffwatchInnAndBuildersHall(game) {
  for (let i = 0; i < 4; i++) {
    addQuest(
      game,
      questFromTopOfDeck(game),
      game.board.cliffwatchInn,
      "Cliffwatch Inn"
    );
  }
  for (let i = 0; i < 3; i++) {
    addBuilding(game, game.board.buildersHall);
  }
}

const addPoints = (module.exports.addPoints = function (
  game,
  player,
  numPoints
) {
  player.score += numPoints;
  game.gameLog.log.unshift({
    content: player.name + " scored " + numPoints + " points",
    player,
  });
});

//can get quests from different places - top of deck or cliffwatch inn
//locationArr can be player.quests, Cliffwatch Inn, questDiscards
const addQuest = (module.exports.addQuest = function (
  game,
  quest,
  locationArr,
  nameOfLocationArr
) {
  game.gameLog.log.unshift({
    content: quest.name + " added to " + nameOfLocationArr,
  });
  locationArr.push(quest);
});

//can only get intrigues from topOfDeck
//either player.intrigues or intrigueDiscard
function addXIntrigues(game, player, numIntrigues) {
  for (let i = 0; i < numIntrigues; i++) {
    player.intrigues.push(intrigueFromTopOfDeck(game));
  }

  game.gameLog.log.unshift({
    player,
    content:
      player.name +
      " received " +
      numIntrigues +
      (numIntrigues > 1 ? " Intrigues" : " Intrigue"),
  });
}

function addLord(game, player) {
  player.lord = getTopOfPile(game, game.lordsDeck);
}

function addBuilding(game, locationArr) {
  locationArr.push(buildingFromTopOfPile(game));
}

function getXQuestsFromTopOfDeck(game, numberOfQuests) {
  let questList = [];
  for (let i = 0; i < numberOfQuests; i++) {
    questList.push(questFromTopOfDeck(game));
  }
  return questList;
}

const questFromTopOfDeck = (module.exports.questFromTopOfDeck = function (
  game
) {
  return getTopOfPile(game, game.questsDeck, game.questsDiscardPile);
});

function intrigueFromTopOfDeck(game) {
  return getTopOfPile(game, game.intriguesDeck, game.intriguesDiscardPile);
}

function buildingFromTopOfPile(game) {
  return getTopOfPile(game, game.buildingsStack, game.buildingsDiscardPile);
}

//in case there are no cards left in deck, have discardPile as backup
function getTopOfPile(game, deck, discardPile) {
  if (deck.length > 0) return deck.pop();
  else {
    game.gameLog.log.unshift({
      content: "No cards left in deck, shuffling discardPile now",
    });
    deck = shuffle(discardPile);
    discardPile = [];
    return getTopOfPile(game, deck, discardPile);
  }
}

//functions for spots at Cliffwatch Inn

//grabs selected index quest from CWInn. adds it to desired list, also replaces missing quest with a new quest from top of the deck
const getQuestFromCliffwatchInnAndMoveTo = (module.exports.getQuestFromCliffwatchInnAndMoveTo = function (
  game,
  indexInCWI,
  whereToSendTheQuest,
  nameForWhereToSendQuest
) {
  const quest = game.board.cliffwatchInn[indexInCWI];
  addQuest(game, quest, whereToSendTheQuest, nameForWhereToSendQuest);
  const newQuest = questFromTopOfDeck(game);
  game.board.cliffwatchInn[indexInCWI] = newQuest;
  game.gameLog.log.unshift({
    content:
      "New quest at spot " +
      (indexInCWI + 1) +
      " of Cliffwatch Inn - " +
      newQuest.name,
  });
});

//replace all 4 quests at cliffwatch inn with new quests, send old quests to discardPile
function resetQuests(game) {
  for (let i = 0; i < game.board.cliffwatchInn.length; i++) {
    getQuestFromCliffwatchInnAndMoveTo(
      game,
      i,
      game.questsDiscardPile,
      "Quest Discard Pile"
    );
  }
}

//functions that were in choiceLogic.js

const choiceTypes = (module.exports.choiceTypes = {
  PICK_QUEST_FROM_CWI: {
    STRING: "pick_quest_from_cwi",
    CHOICE_OBJ_FUNCTION: createCliffwatchInnChoiceObj,
    AFTER_SELECTION_FUNCTION: handleCliffwatchInnChoice,
  },
  COMPLETE_QUEST: {
    STRING: "complete_quest",
    CHOICE_OBJ_FUNCTION: createCompleteQuestChoiceObj,
    AFTER_SELECTION_FUNCTION: handleCompleteQuestChoice,
  },
  PLAY_INTRIGUE: {
    STRING: "play_intrigue",
    CHOICE_OBJ_FUNCTION: createIntrigueChoiceObj,
    AFTER_SELECTION_FUNCTION: handleIntrigueChoice,
  },
  BUY_BUILDING: {
    STRING: "buy_building",
    CHOICE_OBJ_FUNCTION: createBuyBuildingChoiceObj,
    AFTER_SELECTION_FUNCTION: handleBuyBuildingChoice,
  },
  PICK_ANOTHER_PLAYER: {
    STRING: "pick_another_player",
    CHOICE_OBJ_FUNCTION: createAnotherPlayerChoiceObj,
    AFTER_SELECTION_FUNCTION: handleOtherPlayerChoice,
  },
  RESOURCE: {
    STRING: "resource_choice",
    CHOICE_OBJ_FUNCTION: createResourcesChoiceObj,
    AFTER_SELECTION_FUNCTION: handleResourcesChoice,
  },
  GIVE_RESOURCE_FOR_POINTS: {
    STRING: "give_resource_for_points",
    CHOICE_OBJ_FUNCTION: createGiveResourceForPointsChoicesObj,
    AFTER_SELECTION_FUNCTION: handleGiveResourceForPointsChoice,
  },
  GIVE_RESOURCE_TO_PLAYER: {
    STRING: "give_resource_to_player",
    CHOICE_OBJ_FUNCTION: createGiveResourceToAnotherPlayerChoicesObj,
    AFTER_SELECTION_FUNCTION: handleGiveResourceToAnotherPlayer,
  },
  QUEST_TYPE: {
    STRING: "quest_type",
    CHOICE_OBJ_FUNCTION: createQuestTypeChoiceObj,
    AFTER_SELECTION_FUNCTION: handleGetFirstQuestOfQuestType,
  },
  DRAW_QUEST_FOR_ALL_PLAYERS: {
    STRING: "draw_quest_for_all_players",
    CHOICE_OBJ_FUNCTION: createQuestChoiceObj,
    AFTER_SELECTION_FUNCTION: handleQuestForEachPlayer,
  },
  GO_ON_A_BUILDERS_HALL_SPOT: {
    STRING: "go_on_a_buildersHall_spot",
    CHOICE_OBJ_FUNCTION: createGoOnBuildersHallSpotChoiceObj,
    AFTER_SELECTION_FUNCTION: handleGoOnBuildersHallSpot,
  },
  RETURN_1_TO_POOL: {
    STRING: "return_1_to_pool",
    CHOICE_OBJ_FUNCTION: createReturnToPoolChoiceObj,
    AFTER_SELECTION_FUNCTION: handleReturnToPool,
  },
  WANT_TO_DISCARD_QUEST: {
    STRING: "want_to_discard_quest",
    CHOICE_OBJ_FUNCTION: createWantToDiscardQuestChoiceObj,
    AFTER_SELECTION_FUNCTION: handleWantToDiscardQuest,
  },
  DISCARD_QUEST: {
    STRING: "discard_quest",
    CHOICE_OBJ_FUNCTION: createDiscardQuestChoiceObj,
    AFTER_SELECTION_FUNCTION: handleDiscardQuest,
  },
  DISCARD_BUILDING: {
    STRING: "discard_building",
    CHOICE_OBJ_FUNCTION: createDiscardBuildingChoiceObj,
    AFTER_SELECTION_FUNCTION: handleDiscardBuilding,
  },
  REPLACE_BUILDING: {
    STRING: "replace_building",
    CHOICE_OBJ_FUNCTION: createReplacementBuildingChoiceObj,
    AFTER_SELECTION_FUNCTION: handleReplaceBuilding,
  },
  PICK_PLAYER_AND_REMOVE_CUBE_OF_CHOICE: {
    STRING: "pick_player_and_remove_cube_of_choice",
    CHOICE_OBJ_FUNCTION: createPickPlayerAndRemoveCubeChoiceObj,
    AFTER_SELECTION_FUNCTION: handlePickPlayerAndRemoveCube,
  },

  REMOVE_CUBE_OF_CHOICE: {
    STRING: "remove_cube_of_choice",
    CHOICE_OBJ_FUNCTION: createRemoveCubeChoiceObj,
    AFTER_SELECTION_FUNCTION: handleRemoveCube,
  },
  GO_ON_OPPONENT_SPOT: {
    STRING: "go_on_opponent_spot",
    CHOICE_OBJ_FUNCTION: createUseAnOpponentsSpotChoiceObj,
    AFTER_SELECTION_FUNCTION: handleUseOpponentSpot,
  },
  GET_BUILDING_FROM_BH: {
    STRING: "get_building_from_BH",
    CHOICE_OBJ_FUNCTION: createGetBuildingChoiceObj,
    AFTER_SELECTION_FUNCTION: handleGetBuilding,
  },
  WANT_TO_REPLACE_CUBE_WITH_WHITE_CUBE: {
    STRING: "want_to_replace_cube_with_white_cube",
    CHOICE_OBJ_FUNCTION: createWantToReplaceWithWhiteCubeChoiceObj,
    AFTER_SELECTION_FUNCTION: handleWantToReplaceWithWhiteCube,
  },
  REPLACE_CUBE_WITH_WHITE_CUBE: {
    STRING: "replace_cube_with_white_cube",
    CHOICE_OBJ_FUNCTION: createReplaceWithWhiteCubeChoiceObj,
    AFTER_SELECTION_FUNCTION: handleReplaceWithWhiteCube,
  },
  DEDUCT_RESOURCES: {
    STRING: "deduct_resources",
    CHOICE_OBJ_FUNCTION: createDeductResourcesChoiceObj,
    AFTER_SELECTION_FUNCTION: handleDeductResourcesChoice,
  },
  GET_QUEST_AND_IMMEDIATELY_COMPLETE: {
    STRING: "get_quest_and_immediately_complete",
    CHOICE_OBJ_FUNCTION: createGetQuestImmediatelyCompleteChoiceObj,
    AFTER_SELECTION_FUNCTION: handleGetQuestImmediatelyCompleteChoice,
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

function handleResourcesChoice(
  game,
  player,
  selectedResourceNamesArr,
  onUpdateGame,
  resourceAmounts,
  playerToReceive,
  additionalResourceObj
) {
  return new Promise((resolve) => {
    game.gameLog.log.unshift({
      player,
      content: player.name + " selected " + selectedResourceNamesArr,
    });
    let resourceObjs = [];
    for (let i = 0; i < selectedResourceNamesArr.length; i++) {
      let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
      Object.keys(resourceObj).forEach((resourceName) => {
        if (resourceName === selectedResourceNamesArr[i])
          resourceObj[resourceName] = resourceAmounts[resourceName];
      });
      resourceObjs.push(resourceObj);
    }
    let totalSelectedResourceObj = combineSelectedResources(resourceObjs);
    if (!additionalResourceObj) additionalResourceObj = {};
    let totalReceivedResources = addResourcesForPlayer(
      game,
      player,
      additionalResourceObj,
      totalSelectedResourceObj
    );
    resolve(totalReceivedResources);
  });
}

function combineSelectedResources(totalSelectedResourceObjs) {
  let totalChosenResources = {};
  for (let i = 0; i < totalSelectedResourceObjs.length; i++) {
    totalChosenResources = addResources(
      totalChosenResources,
      totalSelectedResourceObjs[i]
    );
  }
  return totalChosenResources;
}

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

function handleCliffwatchInnChoice(game, player, selectedQuestNameArr) {
  return new Promise((resolve) => {
    for (let i = 0; i < game.board.cliffwatchInn.length; i++) {
      let quest = game.board.cliffwatchInn[i];

      if (quest.name.trim() === selectedQuestNameArr[0].trim()) {
        getQuestFromCliffwatchInnAndMoveTo(
          game,
          i,
          player.activeQuests,
          player.name + " active quests"
        );
        resolve(quest);
        return;
      }
      // resolve(quest);
    }
  });
}

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

function handleCompleteQuestChoice(
  game,
  player,
  selectedQuestNameArr,
  onUpdateGame
) {
  return new Promise((resolve) => {
    let quest = player.activeQuests.find(
      (quest) => quest.name === selectedQuestNameArr[0]
    );
    let message;
    let questSpecial = quest.reward.special;
    if (questSpecial) {
      if (
        questSpecial.type === "get_building_from_BH" ||
        questSpecial.type === "get_building_from_stack"
      ) {
        if (!isSpotsLeftToBuyBuildings(game)) {
          if (
            confirm(
              "You won't be able to receive all the rewards for this Quest (There are no more spots for additional buildings), are you sure you want to complete this Quest?"
            )
          ) {
            message =
              player.name +
              " completed " +
              quest.name +
              " but couldn't get Building reward";
          } else {
            resolve(null);
            return;
          }
        }
      }
    }
    completeQuest(game, player, quest, onUpdateGame).then((returnedGame) => {
      resolve(returnedGame);
    });
    if (message)
      game.gameLog.log.unshift({
        player,
        content: message,
      });
  });
}

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

function handleIntrigueChoice(
  game,
  player,
  selectedIntrigueKeyArr,
  onUpdateGame
) {
  return new Promise((resolve) => {
    let intrigue = player.intrigues.find(
      (intrigue) => intrigue.key === selectedIntrigueKeyArr[0]
    );
    if (intriguesThatPlayerCanPlay(player, game).includes(intrigue)) {
      playIntrigue(game, player, intrigue, onUpdateGame).then(
        (returnedGame) => {
          resolve(returnedGame);
        }
      );
    } else {
      if (
        confirm(
          "You won't be able to receive the rewards for this Intrigue, are you sure you want to select this option?"
        )
      ) {
        game.gameLog.log.unshift({
          content:
            player.name +
            " played " +
            intrigue.name +
            " but didn't get rewards",
          player,
        });
        game.intriguesDiscardPile.push(intrigue);
        removeItemFromList(player.intrigues, intrigue);
        resolve(game);
      } else resolve(null);
    }
  });
}

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

function handleBuyBuildingChoice(game, player, selectedBuildingNameArr) {
  return new Promise((resolve) => {
    game.gameLog.log.unshift({
      player,
      content: player.name + " chose to buy " + selectedBuildingNameArr,
    });
    for (let i = 0; i < game.board.buildersHall.length; i++) {
      let building = game.board.buildersHall[i];

      if (building.name === selectedBuildingNameArr[0]) {
        getBuildingFromBuildersHallAndMoveToBuildingsInPlay(
          game,
          player,
          i,
          true
        );
      }
      resolve(building);
    }
  });
}

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

function handleOtherPlayerChoice(game, player, selectedOtherPlayerNameArr) {
  return new Promise((resolve) => {
    let selectedOtherPlayer;
    game.players.forEach((player) => {
      if (player.name === selectedOtherPlayerNameArr[0])
        selectedOtherPlayer = player;
    });
    resolve(selectedOtherPlayer);
  });
}

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

function handleGiveResourceForPointsChoice(
  game,
  playerThatSelected,
  selectedValueArr,
  onUpdateGame,
  resourceAmounts,
  playerToReceive,
  rewardObjForPlayerToReceive
) {
  return new Promise((resolve) => {
    if (selectedValueArr[0] === "Yes") {
      getResources(
        game,
        playerToReceive,
        rewardObjForPlayerToReceive.resources,
        onUpdateGame,
        false
      ).then((returnedGame) => resolve(returnedGame));
      deductResources(
        game,
        playerThatSelected,
        rewardObjForPlayerToReceive.resources,
        onUpdateGame
      );
      addPoints(game, playerThatSelected, rewardObjForPlayerToReceive.points);
    } else resolve(game);
  });
}

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

function handleGiveResourceToAnotherPlayer(
  game,
  playerThatSelected,
  selectedOtherPlayerNameArr,
  onUpdateGame,
  resource
) {
  return new Promise((resolve) => {
    let selectedOtherPlayer;
    game.players.forEach((player) => {
      if (player.name === selectedOtherPlayerNameArr[0])
        selectedOtherPlayer = player;
    });
    getResources(
      game,
      selectedOtherPlayer,
      resource,
      onUpdateGame,
      false
    ).then((returnedGame) => resolve(returnedGame));
  });
}

function createQuestTypeChoiceObj(game) {
  return {
    optionsList: ["ARCANA", "COMMERCE", "PIETY", "SKULLDUGGERY", "WARFARE"],
    // choiceLogicHelperFunction: handleGetFirstQuestOfQuestType,
    component: "regular",
    numberOfOptions: 1,
    modalPrompt: "What type of Quest would you like?",
  };
}

function handleGetFirstQuestOfQuestType(
  game,
  playerThatSelected,
  selectedValueArr
) {
  return new Promise((resolve) => {
    let selectedQuestType = selectedValueArr[0];
    game.gameLog.log.unshift({
      player: playerThatSelected,
      content: playerThatSelected.name + " chose " + selectedQuestType,
    });
    let quest = findFirstQuestOfSelectedType(
      game,
      playerThatSelected,
      selectedQuestType
    );
    resolve(quest);
  });
}

// functions for intrigues with questDeck
function findFirstQuestOfSelectedType(game, player, questType) {
  let quest = questFromTopOfDeck(game);
  while (quest.type !== questType) {
    addQuest(game, quest, game.questsDiscardPile, "Quest Discard Pile");
    quest = questFromTopOfDeck(game);
  }
  //exits this loop once there's a match, so add that quest to players hand
  addQuest(game, quest, player.activeQuests, player.name + "'s active quests");
  return quest;
}

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

function handleQuestForEachPlayer(
  game,
  playerThatSelected,
  selectedQuestNameArr,
  onUpdateGame,
  questList
) {
  return new Promise((resolve) => {
    let questsNotPicked = [];
    for (let i = 0; i < questList.length; i++) {
      let quest = questList[i];
      if (quest.name.trim() === selectedQuestNameArr[0].trim()) {
        game.gameLog.log.unshift({
          player: playerThatSelected,
          content: playerThatSelected.name + " selected " + quest.name,
        });
        addQuest(
          game,
          quest,
          playerThatSelected.activeQuests,
          playerThatSelected.name + "'s active quests"
        );
      } else {
        questsNotPicked.push(quest);
      }
    }
    // let indexOfCurrPlayer = game.players.indexOf(playerThatSelected);
    let indexOfNextPlayer = (playerThatSelected.id + 1) % game.players.length;
    let nextPlayer = game.players[indexOfNextPlayer];
    let numberOfQuestsLeft = questsNotPicked.length;
    if (numberOfQuestsLeft > 1) {
      makeChoiceNew(
        game,
        choiceTypes.DRAW_QUEST_FOR_ALL_PLAYERS,
        nextPlayer,
        onUpdateGame,
        questsNotPicked
      ).then(resolve(game));
    } else {
      game.gameLog.log.unshift({
        player: nextPlayer,
        content:
          "Only 1 Quest left, in list, automatically give to " +
          nextPlayer.name,
      });
      addQuest(
        game,
        questsNotPicked[0],
        nextPlayer.activeQuests,
        nextPlayer.name + "'s active quests"
      );
      resolve(game);
    }
  });
}

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

function handleGoOnBuildersHallSpot(
  game,
  playerThatSelected,
  selectedValueArr,
  onUpdateGame
) {
  return new Promise((resolve) => {
    let selectedSpotName = selectedValueArr[0];
    let selectedBuilding;
    game.board.buildersHall.forEach((building) => {
      if (building.name === selectedSpotName) selectedBuilding = building;
    });
    spotPicked(game, playerThatSelected, selectedBuilding, onUpdateGame).then(
      (returnedGame) => {
        // if (returnedGame !== null) {
        //   game.gameLog.log.unshift({
        //     player: playerThatSelected,
        //     content:
        //       playerThatSelected.name +
        //       " chose to use one of their unused Pieces to go on " +
        //       selectedBuilding.name,
        //   });
        // }
        resolve(returnedGame);
      }
    );
  });
}

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

function handleReturnToPool(
  game,
  playerThatSelected,
  selectedValueArr,
  onUpdateGame,
  spotsThatPlayerHasBeenOnList
) {
  return new Promise((resolve) => {
    let selectedSpotNameOrShortName = selectedValueArr[0];
    let selectedSpot = spotsThatPlayerHasBeenOnList.find((spot) => {
      if (spot.name) {
        if (spot.name === selectedSpotNameOrShortName) return spot;
      } else {
        if (spot.shortName === selectedSpotNameOrShortName) return spot;
      }
    });
    unDoPlayerMoveOnSpot(game, playerThatSelected, selectedSpot);
    resolve(game);
  });
}

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

function handleWantToDiscardQuest(
  game,
  playerThatSelected,
  selectedValueArr,
  onUpdateGame,
  specialObj,
  playerThatCalledMakeChoice
) {
  return new Promise((resolve) => {
    if (selectedValueArr[0] === "Yes") {
      makeChoiceNew(
        game,
        choiceTypes.DISCARD_QUEST,
        playerThatSelected,
        onUpdateGame,
        specialObj,
        playerThatCalledMakeChoice
      ).then((returnedGame) => resolve(returnedGame));
    } else resolve(game);
  });
}

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

function handleDiscardQuest(
  game,
  playerThatSelected,
  selectedQuestNameArr,
  onUpdateGame,
  specialObj,
  playerThatCalledMakeChoice
) {
  return new Promise((resolve) => {
    let quest = playerThatSelected.activeQuests.find(
      (quest) => quest.name === selectedQuestNameArr[0]
    );
    if (quest.type === "MANDATORY QUEST") {
      game.intriguesDiscardPile.push(quest);
      game.gameLog.log.unshift({
        content: quest.name + " added to Intrigue Discard Pile",
      });
    } else {
      addQuest(game, quest, game.questsDiscardPile, "Quest Discard Pile");
    }
    removeItemFromList(playerThatSelected.activeQuests, quest);
    let pointsToReceive =
      playerThatSelected.name === playerThatCalledMakeChoice.name
        ? specialObj.points
        : specialObj.otherPlayerPoints;

    addPoints(game, playerThatSelected, pointsToReceive);
    resolve(game);
  });
}

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

function handleDiscardBuilding(
  game,
  player,
  selectedBuildingNameArr,
  onUpdateGame
) {
  return new Promise((resolve) => {
    let selectedBuildingToDiscard = game.board.buildingsInPlay.find(
      (building) => building.name === selectedBuildingNameArr[0]
    );
    game.gameLog.log.unshift({
      player,
      content:
        player.name +
        " selected to discard " +
        selectedBuildingToDiscard.name +
        " (building)",
    });
    makeChoiceNew(
      game,
      choiceTypes.REPLACE_BUILDING,
      player,
      onUpdateGame,
      selectedBuildingToDiscard
    ).then((returnedGame) => {
      resolve(returnedGame);
    });
  });
}

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

function handleReplaceBuilding(
  game,
  player,
  selectedBuildingNameArr,
  onUpdateGame,
  discardedBuilding
) {
  return new Promise((resolve) => {
    //discard old building
    removeItemFromList(player.buildingsOwned, discardedBuilding);
    discardedBuilding.ownerID = "";
    discardedBuilding.inPlay = false;
    //change discardedBuilding spot in buildingsInPlay spots back to an integer
    for (let i = 0; i < game.board.buildingsInPlay.length; i++) {
      let building = game.board.buildingsInPlay[i];
      if (building.name === discardedBuilding.name) {
        game.board.buildingsInPlay[i] = i;
      }
    }
    game.buildingsDiscardPile.push(discardedBuilding);

    //replacement building
    for (let i = 0; i < game.board.buildersHall.length; i++) {
      let building = game.board.buildersHall[i];
      if (building.name === selectedBuildingNameArr[0]) {
        getBuildingFromBuildersHallAndMoveToBuildingsInPlay(game, player, i);
      }
    }
    resolve(game);
  });
}

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

function handlePickPlayerAndRemoveCube(
  game,
  playerThatSelected,
  selectedOtherPlayerNameArr,
  onUpdateGame
) {
  return new Promise((resolve) => {
    let selectedOtherPlayer;
    game.players.forEach((player) => {
      if (player.name === selectedOtherPlayerNameArr[0])
        selectedOtherPlayer = player;
    });
    game.gameLog.log.unshift({
      player: playerThatSelected,
      content:
        playerThatSelected.name +
        " selected to take from " +
        selectedOtherPlayer.name,
    });
    makeChoiceNew(
      game,
      choiceTypes.REMOVE_CUBE_OF_CHOICE,
      playerThatSelected,
      onUpdateGame,
      selectedOtherPlayer.resources,
      selectedOtherPlayer
    ).then((returnedGame) => resolve(returnedGame));
  });
}

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

function handleRemoveCube(
  game,
  playerThatSelected,
  selectedResourceNamesArr,
  onUpdateGame,
  resourceAmounts,
  playerToDeduct
) {
  return new Promise((resolve) => {
    game.gameLog.log.unshift({
      player: playerThatSelected,
      content:
        playerThatSelected.name +
        " selected to take a " +
        selectedResourceNamesArr +
        " cube",
    });
    let resourceObjs = [];
    for (let i = 0; i < selectedResourceNamesArr.length; i++) {
      let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
      Object.keys(resourceObj).forEach((resourceName) => {
        if (resourceName === selectedResourceNamesArr[i])
          resourceObj[resourceName] = resourceAmounts[resourceName];
      });
      resourceObjs.push(resourceObj);
    }
    let totalSelectedResourceObj = combineSelectedResources(resourceObjs);
    deductResources(
      game,
      playerToDeduct,
      totalSelectedResourceObj,
      onUpdateGame
    );
    getResources(
      game,
      playerThatSelected,
      totalSelectedResourceObj,
      onUpdateGame,
      true
    );
    resolve(game);
  });
}

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

function handleUseOpponentSpot(
  game,
  playerThatSelected,
  selectedValueArr,
  onUpdateGame,
  spotsOpponentsHaveGoneOnThisRound
) {
  return new Promise((resolve) => {
    let selectedSpotNameOrShortName = selectedValueArr[0];
    let selectedSpot = spotsOpponentsHaveGoneOnThisRound.find((spot) => {
      if (spot.name) {
        if (spot.name === selectedSpotNameOrShortName) return spot;
      } else {
        if (spot.shortName === selectedSpotNameOrShortName) return spot;
      }
    });
    let go_on_spot = false;
    if (playerThatSelected.use_zoarstar) {
      if (selectedSpot.group === "WATERDEEP HARBOR") go_on_spot = true;
    }
    useActionSpace(
      game,
      playerThatSelected,
      selectedSpot,
      onUpdateGame,
      go_on_spot
    ).then((returnedGame) => {
      if (returnedGame !== null) {
        game.gameLog.log.unshift({
          player: playerThatSelected,
          content:
            playerThatSelected.name +
            " chose to use " +
            selectedSpotNameOrShortName +
            "'s action space",
        });
        if (playerThatSelected.use_zoarstar) {
          playerThatSelected.use_zoarstar = false;
        }
      }
      resolve(returnedGame);
    });
  });
}

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

function handleGetBuilding(game, player, selectedBuildingNameArr) {
  return new Promise((resolve) => {
    //replacement building
    for (let i = 0; i < game.board.buildersHall.length; i++) {
      let building = game.board.buildersHall[i];
      if (building.name === selectedBuildingNameArr[0]) {
        getBuildingFromBuildersHallAndMoveToBuildingsInPlay(game, player, i);
      }
    }
    resolve(game);
  });
}

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

function handleWantToReplaceWithWhiteCube(
  game,
  playerThatSelected,
  selectedValueArr,
  onUpdateGame
) {
  return new Promise((resolve) => {
    if (selectedValueArr[0] === "Yes") {
      makeChoiceNew(
        game,
        choiceTypes.REPLACE_CUBE_WITH_WHITE_CUBE,
        playerThatSelected,
        onUpdateGame
      ).then((returnedGame) => resolve(returnedGame));
    } else resolve(game);
  });
}

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

function handleReplaceWithWhiteCube(
  game,
  playerThatSelected,
  selectedResourceNamesArr,
  onUpdateGame,
  resourceAmounts
) {
  return new Promise((resolve) => {
    game.gameLog.log.unshift({
      player: playerThatSelected,
      content:
        playerThatSelected.name +
        " selected to replace a " +
        selectedResourceNamesArr +
        " cube with a white cube",
    });
    let resourceObjs = [];
    for (let i = 0; i < selectedResourceNamesArr.length; i++) {
      let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
      Object.keys(resourceObj).forEach((resourceName) => {
        if (resourceName === selectedResourceNamesArr[i])
          resourceObj[resourceName] = resourceAmounts[resourceName];
      });
      resourceObjs.push(resourceObj);
    }
    let totalSelectedResourceObj = combineSelectedResources(resourceObjs);
    deductResources(
      game,
      playerThatSelected,
      totalSelectedResourceObj,
      onUpdateGame
    );
    addResourcesForPlayer(game, playerThatSelected, {white: 1}, {});
    playerThatSelected.replace_cube_with_white_cube = false;
    resolve(game);
  });
}

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

function handleDeductResourcesChoice(
  game,
  player,
  selectedResourceNamesArr,
  onUpdateGame
) {
  return new Promise((resolve) => {
    game.gameLog.log.unshift({
      player,
      content: player.name + " selected " + selectedResourceNamesArr,
    });
    let resourceObjs = [];
    let resourceAmounts = {orange: 1, black: 1, purple: 1, white: 1};
    for (let i = 0; i < selectedResourceNamesArr.length; i++) {
      let resourceObj = {orange: 0, black: 0, purple: 0, white: 0, gold: 0};
      Object.keys(resourceObj).forEach((resourceName) => {
        if (resourceName === selectedResourceNamesArr[i])
          resourceObj[resourceName] = resourceAmounts[resourceName];
      });
      resourceObjs.push(resourceObj);
    }
    let totalSelectedResourceObj = combineSelectedResources(resourceObjs);
    deductResources(game, player, totalSelectedResourceObj);
    resolve(totalSelectedResourceObj);
  });
}

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

function handleGetQuestImmediatelyCompleteChoice(
  game,
  player,
  selectedQuestNameArr,
  onUpdateGame
) {
  return new Promise((resolve) => {
    for (let i = 0; i < game.board.cliffwatchInn.length; i++) {
      let quest = game.board.cliffwatchInn[i];

      if (quest.name.trim() === selectedQuestNameArr[0].trim()) {
        let selectedQuest = quest;
        getQuestFromCliffwatchInnAndMoveTo(
          game,
          i,
          player.activeQuests,
          player.name + " active quests"
        );
        if (
          !player.activeQuests.find((quest) => quest.type === "MANDATORY QUEST")
        ) {
          if (enoughResources(player, selectedQuest.requires)) {
            if (
              confirm(
                "You have enough resources to immediately complete " +
                  selectedQuest.name +
                  ". Would you like to do so for an additional 4 points?"
              )
            ) {
              completeQuest(game, player, selectedQuest, onUpdateGame);
              game.gameLog.log.unshift({
                player,
                content:
                  player.name +
                  " gets an additional 4 points because they were able to immediately complete " +
                  selectedQuest.name,
              });
              addPoints(game, player, 4);
            }
          }
        } else {
          game.gameLog.log.unshift({
            player,
            content:
              player.name +
              " cannot immedaitely complete " +
              selectedQuest.name +
              " because they have a Mandatory Quest",
          });
        }
      }
    }
    resolve(game);
  });
}
