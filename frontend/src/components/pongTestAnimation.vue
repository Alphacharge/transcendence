<template>
	<button @click="newGame()">Start Game</button>
	<button @click="stopGame()">Stop Game</button>
	<div class="container">
		<div class="hinter-grund" ref="container"></div>
		<div class="bouncing-ball" :style="{ top: `${bouncingBallY}px`, left: `${bouncingBallX}px` }"></div>
		<div class="paddle" :style="{ top: `${paddleY}px` }"></div>
  </div>
</template>


<script>
// import the socket object
import { socket } from '../socket';

export default {
props: ['pongTestPaddleBouncing'],
data() {
	return {
	// abll and paddle starting positions
	bouncingBallX: 400,
	bouncingBallY: 200,
	paddleY: 150,
	animationFrameId: null,
	gameId: null, // send this to the backend for game identification
	}
},
mounted() {

	// received game ID from server
	socket.on("gameId", (id) => {
		this.gameId = id;
		console.log("received Game ID from server", this.gameId);
	});

	// received ball update from server
	socket.on("ballUpdate", (ballCoordinates) => {
		this.bouncingBallX = ballCoordinates.x;
		this.bouncingBallY = ballCoordinates.y;
	});

	// received paddle movement from server
	socket.on("leftPaddle", (pY) => {
		this.paddleY = pY;
	});
	// socket.on("rightPaddle", (pY) => {
		// insert right paddle
	// });

	window.addEventListener("keydown", (event) => {
		if (!this.gameId) {
			console.error("No game ID found!");
			return;
		}
		if (event.key === "w") {
			socket.sendLeftPaddleUp(this.gameId);
		} else if (event.key === "s") {
			socket.sendLeftPaddleDown(this.gameId);
		}
	});
},

beforeUnmounted() {
// Clean up by canceling the animation frame
	if(this.animationFrameId) {
	cancelAnimationFrame(this.animationFrameId);
}
// Remove the event listener for keydown events
window.removeEventListener("keydown", this.handleKeyDown);
},

methods: {
	newGame() {
		socket.newGame();
	},
	stopGame() {
		socket.stopGame(this.gameId);
	}
}
};
</script>

<style>
  .container {
    position: relative;
    width: 800px;
    height: 400px;
    overflow: hidden;
  }

  .hinter-grund {
    width: 100%;
    height: 100%;
    background-color: grey;
    box-sizing: border-box;
    border: 8px solid magenta
  }

  .bouncing-ball {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: greenyellow;
    border-radius: 50%;
  }

  .paddle {
    position: absolute;
    width: 10px;
    height: 100px;
    background-color: blue;
    left: 40px;
    transition: top 0.1s; /* Add a transition for smoother movement */
  }
</style>
