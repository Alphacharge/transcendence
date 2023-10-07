// socket.js

import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

// why does transports websocket prevent cors issues?
export const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.newGame = function () {
  console.log(socket);
  socket.emit("newGame");
};

socket.stopGame = function (gameId) {
  socket.emit("stopGame", gameId);
};

// send paddle position updates to server
socket.sendLeftPaddleUp = function (gameId) {
  socket.emit("leftPaddleUp", gameId);
};

socket.sendLeftPaddleDown = function (gameId) {
  socket.emit("leftPaddleDown", gameId);
};
