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
});

export function connectWebSocket() {
  socket.io.opts.query = {
    token: localStorage.getItem("access_token"),
    userId: localStorage.getItem("userId"),
  };

  socket.connect();
}

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("connect_error", () => {
  connectWebSocket();
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

socket.stopGame = function () {
  socket.emit("stopGame");
};

// send paddle position updates to server
socket.sendPaddleUp = function (gameId) {
  socket.emit("paddleUp", { gameId });
};

socket.sendPaddleDown = function (gameId) {
  socket.emit("paddleDown", { gameId });
};

socket.requestTournamentInfo = function () {
  socket.emit("requestTournamentInfo");
};

export function getSocket() {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
}
