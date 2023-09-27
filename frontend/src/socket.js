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

// send paddle position updates to server
socket.sendPaddleLeftUp = function() {
	console.log("Paddle Up");
	socket.emit('paddleUp');
};

socket.sendPaddleLeftDown = function() {
	console.log("Paddle Down");
	socket.emit('paddleDown');
};
