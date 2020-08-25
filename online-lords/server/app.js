// https://www.valentinog.com/blog/socket-react/
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const cron = require("node-cron");

const removeStaleGames = require("./removeStaleGames");

const port = process.env.PORT || 4001;
const routes = require("./routes");

const {saveGame} = require("./games");

const app = express();
app.use(express.static("dist"));
app.use(express.static("static"));
app.use(bodyParser.json());
app.use(routes);

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
  const room = socket.handshake["query"]["gameId"];
  socket.join(room);

  console.log(`New client connected to room ${room}`);
  socket.on("update", (game) => {
    saveGame(game);
    //changed from io.to(room) to socket.to(room) - I think this changes from sending to all clients in 'room' to now sending to all clients except for sender
    socket.to(room).emit("update", game);
  });
  //is there a place where we define where disconnect?
  socket.on("disconnect", () => {
    socket.leave(room);
    console.log(`Client disconnected to room ${room}`);
  });
});

// remove all games that have been stale for 1 hr. run once a day
// TODO: need to add lastUpdated field to game object for this to work
// cron.schedule("0 0 * * *", removeStaleGames(1));

server.listen(port, () => console.log(`Listening on port ${port}`));
