<template>
  <div class="container">
    <div class="background" ref="container"></div>
    <div class="bouncing-ball"></div>
    <div class="left-paddle"></div>
    <div class="right-paddle"></div>
  </div>
</template>

<script>
// import the socket object
import { socket } from "@/assets/utils/socket";

export default {
  props: ["gameId", "playerNumber"],
  data() {
    return {
      bouncingBallX: this.containerWidth / 2, // Annahme: Du hast eine Variable für die Breite des Containers (containerWidth)
      bouncingBallY: this.containerHeight / 2, // Annahme: Du hast eine Variable für die Höhe des Containers (containerHeight)
      leftPaddleY: this.containerHeight / 2 - 50, // Annahme: Die Paddel sind 100px hoch
      rightPaddleY: this.containerHeight / 2 - 50, // Annahme: Die Paddel sind 100px hoch
      animationFrameId: null,
      messageInterval: null,
    };
  },
  mounted() {

    this.containerWidth = this.$refs.container.offsetWidth;
    this.containerHeight = this.$refs.container.offsetHeight;
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
          }, 10);
        }
      } else if (event.key === "s") {
        if (!this.messageInterval) {
          this.messageInterval = setInterval(() => {
            socket.sendPaddleDown(this.gameId);
          }, 10);
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
/* Achtung: the field geometry is calculated in the backed, while we set absolute values in the styling, this will now work and needs to be fixed */
.container {
  position: relative;
  width: 80vw;  /* 80% der Viewport-Breite */
  height: 40vh; /* 40% der Viewport-Höhe */
  /* max-width: 800px;
  max-height: 400px; */
  overflow: hidden;
}


.background {
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0);
  box-sizing: border-box;
  border: 2px solid magenta;
}

.bouncing-ball {
  position: relative;
  width: 10px;
  height: 10px;
  background-color: greenyellow;
  border-radius: 50%;
  left: 50%;
  bottom: 50%;
  transform: translate(50%, 50%);
}

.left-paddle {
  position: relative;
  width: 10px;
  height: 100px;
  background-color: blue;
  left: 5%;
  bottom: 65%;
  transition: top 0.1s; /* Add a transition for smoother movement */
}

.right-paddle {
  position: relative;
  width: 10px;
  height: 100px;
  background-color: rebeccapurple;
  left: 95%;
  bottom: 85%;
  transition: top 0.1s; /* Add a transition for smoother movement */
}
</style>
