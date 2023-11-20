// socket.js

import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

// why does transports websocket prevent cors issues?
export const socket = io("wss://" + process.env.VUE_APP_BACKEND_IP + ":3000", {
  transports: ["websocket"],
  autoConnect: false,
  query: {
    userId: localStorage.getItem("userId"),
    token: localStorage.getItem("access_token"),
  },
});

export function connectWebSocket() {
  socket.query.token = localStorage.getItem("access_token");
  socket.connect();
}

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.enterQueue = function () {
  socket.emit("enterQueue");
};

socket.enterTournamentQueue = function (tournamentStatus) {
  socket.emit("enterTournamentQueue", tournamentStatus);
};

socket.leaveQueue = function () {
  socket.emit("leaveQueue");
};

socket.stopGame = function (gameId) {
  socket.emit("stopGame", gameId);
};

// send paddle position updates to server
socket.sendPaddleUp = function (gameId) {
  socket.emit("paddleUp", { gameId });
};

socket.sendPaddleDown = function (gameId) {
  socket.emit("paddleDown", { gameId });
};

export function getSocket() {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
}
