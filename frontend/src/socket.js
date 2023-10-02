// socket.js

import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
	connected: false,
	fooEvents: [],
	barEvents: []
});

// why does transports websocket prevent cors issues?
export const socket = io("http://localhost:3000", {
	transports: ['websocket']
});

socket.on("connect", () => {
	socket.emit('f5');
	console.log("PRINT FRONTEND");
	state.connected = true;
});

socket.on("disconnect", () => {
	state.connected = false;
});

socket.on("foo", (...args) => {
	state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
	state.barEvents.push(args);
});

// define test event function
socket.newMessage = function (message) {
	console.log(socket);
	message = "This is a test message!";
	socket.emit('newMessage', message);
};

socket.f5 = function() {
	socket.emit('f5');
}

// send paddle position updates to server
socket.sendLeftPaddleUp = function() {
	console.log("Paddle Up");
	socket.emit('leftPaddleUp');
};

socket.sendLeftPaddleDown = function() {
	console.log("Paddle Down");
	socket.emit('leftPaddleDown');
};

window.addEventListener("beforeunload", () => {
	// Send a message to the server indicating a page refresh
	socket.emit("pageRefresh");
  });
