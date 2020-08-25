// had to do this to access from cron job
const games = {};
module.exports.games = games;

let count = 0;
module.exports.generateGameId = function () {
  let id;
  do {
    id = ++count % 10000;
  } while (games[id]);
  return id;
};

module.exports.saveGame = function (game) {
  games[game.gameId] = game;
};

module.exports.getGameObject = function (gameId) {
  return games[gameId];
};
