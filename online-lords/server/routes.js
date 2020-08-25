const express = require("express");
const router = express.Router();
const { createGame } = require('../shared/logic');
const { generateGameId, saveGame, getGameObject } = require("./games");

router.post("/api/game", (req, res) => {
  const game = createGame(generateGameId(), req.body.numPlayers);
  saveGame(game);
  res.json(game);
});

router.get("/api/game/:gameId", (req, res) => {
  const game = getGameObject(req.params.gameId);
  if (game) {
    res.json(game);
  } else {
    res.sendStatus(400);
  }
});

router.get("/", (req, res) => {
  res.sendFile("home.html", { root: "dist" });
});

router.get("/:gameId", (req, res, next) => {
  // only go to game page if game exists
  if (getGameObject(req.params.gameId)) {
    res.sendFile("game.html", { root: 'dist' });
  } else {
    next();
  }
});

// redirect to home page if no game was found
router.get("*", (req, res) => {
  res.redirect('/');
});

module.exports = router;