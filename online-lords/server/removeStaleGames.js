const moment = require('moment');
const { games } = require('./games');

module.exports = function(numStaleHours) {
  return () => {
    console.log(`starting cron job: ${Object.keys(games).length} games`);
    Object.entries(games).forEach(entry => {
      const gameId = entry[0];
      const game = entry[1];
      const lastUpdated = moment(game.lastUpdated);
      const now = moment();
      const hoursSince = now.diff(lastUpdated, 'hours', true);
      if (hoursSince >= numStaleHours) {
        delete games[gameId];
      }
    });
    console.log(`completed cron job: ${Object.keys(games).length} games remaining`);
  };
}