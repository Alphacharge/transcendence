<template>
  <div class="container">
    <div class="background" ref="container"></div>
    <div
      class="bouncing-ball"
      :style="{ top: `${bouncingBallY}px`, left: `${bouncingBallX}px` }"
    ></div>
    <div class="left-paddle" :style="{ top: `${leftPaddleY}px` }"></div>
    <div class="right-paddle" :style="{ top: `${rightPaddleY}px` }"></div>
  </div>
</template>

<script>
// import the socket object
import { socket } from "@/assets/utils/socket";

export default {
  props: ["gameId", "playerNumber"],
  data() {
    return {
      // abll and paddle starting positions
      bouncingBallX: 400,
      bouncingBallY: 200,
      leftPaddleY: 150,
      rightPaddleY: 150,
      animationFrameId: null,
      messageInterval: null,
    };
  },
  mounted() {
    // received ball update from server
    socket.on("ballUpdate", (ballCoordinates) => {
      this.bouncingBallX = ballCoordinates.x;
      this.bouncingBallY = ballCoordinates.y;
    });

    // received paddle movement from server
    socket.on("leftPaddle", (pY) => {
      this.leftPaddleY = pY;
    });
    socket.on("rightPaddle", (pY) => {
      this.rightPaddleY = pY;
    });

    // send paddle movement messages
    window.addEventListener("keydown", (event) => {
      if (!this.gameId) {
        return;
      }
      if (event.key === "w") {
        if (!this.messageInterval) {
          console.log("sending paddle up with id", this.gameId);
          this.messageInterval = setInterval(() => {
            socket.sendPaddleUp(this.gameId);
          }, 1000 / 15);
        }
      } else if (event.key === "s") {
        if (!this.messageInterval) {
          this.messageInterval = setInterval(() => {
            socket.sendPaddleDown(this.gameId);
          }, 1000 / 15);
        }
      }
    });
    // stop sending paddle movement messages
    window.addEventListener("keyup", (event) => {
      if (event.key === "w" || event.key === "s") {
        clearInterval(this.messageInterval);
        this.messageInterval = null;
      }
    });
  },

  beforeUnmounted() {
    console.log("unmount called");
    // Clean up by canceling the animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Remove the event listener for keydown events
    window.removeEventListener("keydown");
    window.removeEventListener("keyup");
    clearInterval(this.messageInterval);
    this.messageInterval = null;
  },

  methods: {
    newGame() {
      console.error("logging new game event");
      socket.newGame();
    },
    stopGame() {
      socket.stopGame(this.gameId);
    },
  },
};
</script>

<style>
.container {
  position: relative;
  width: 800px;
  height: 400px;
  overflow: hidden;
}

.background {
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0);;
  box-sizing: border-box;
  border: 10px solid magenta;
}

.bouncing-ball {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: greenyellow;
  border-radius: 50%;
}

.left-paddle {
  position: absolute;
  width: 10px;
  height: 100px;
  background-color: blue;
  left: 40px;
  transition: top 0.1s; /* Add a transition for smoother movement */
}

.right-paddle {
  position: absolute;
  width: 10px;
  height: 100px;
  background-color: rebeccapurple;
  left: 760px;
  transition: top 0.1s; /* Add a transition for smoother movement */
}
</style>
