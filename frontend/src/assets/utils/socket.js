// socket.js

import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

// why does transports websocket prevent cors issues?
export const socket = io(
  "wss://" +
    process.env.VUE_APP_SERVER_IP +
    ":" +
    process.env.VUE_APP_BACKEND_PORT,
  {
    transports: ["websocket"],
    autoConnect: false,
  },
);

export function connectWebSocket() {
  socket.io.opts.query = {
    token: localStorage.getItem("access_token"),
    userId: localStorage.getItem("userId"),
  };

  socket.connect();
}

export function disconnectWebSocket() {
  socket.close();
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
socket.sendPaddleUp = function (localPlayer) {
  socket.emit("paddleUp", { localPlayer });
};

socket.sendPaddleDown = function (localPlayer) {
  socket.emit("paddleDown", { localPlayer });
};

socket.requestTournamentInfo = function () {
  socket.emit("requestTournamentInfo");
};

socket.startLocalGame = function () {
  socket.emit("startLocalGame");
};
