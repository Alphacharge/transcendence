// socket.js

import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

// why does transports websocket prevent cors issues?
export const socket = io("http://" + process.env.VUE_APP_BACKEND_IP + ":3000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.enterQueue = function () {
  socket.emit("enterQueue");
};

socket.leaveQueue = function () {
  socket.emit("leaveQueue");
};

socket.stopGame = function (gameId) {
  socket.emit("stopGame", gameId);
};

// send paddle position updates to server
socket.sendPaddleUp = function (gameId, playerNumber) {
  socket.emit("paddleUp", { gameId, playerNumber });
};

socket.sendPaddleDown = function (gameId, playerNumber) {
  socket.emit("paddleDown", { gameId, playerNumber });
};
