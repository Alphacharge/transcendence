<template>
  <div class="container">
    <div class="background" ref="container"></div>
    <div class="mid-line"></div>
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
  props: {
    isLocalGame: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      // abll and paddle starting positions
      bouncingBallX: 400,
      bouncingBallY: 200,
      leftPaddleY: 150,
      rightPaddleY: 150,
      isGameRunning: false,
    };
  },

  mounted() {

    socket.on("prepareGame", () => {
      this.isGameRunning = true;
    });
    socket.on("victory", () => {
      this.isGameRunning = false;
    });

    socket.on("ballUpdate", (ballCoordinates) => {
      this.bouncingBallX = ballCoordinates.x;
      this.bouncingBallY = ballCoordinates.y;
    });
    socket.on("leftPaddle", (pY) => {
      this.leftPaddleY = pY;
    });
    socket.on("rightPaddle", (pY) => {
      this.rightPaddleY = pY;
    });

    // send paddle movement messages
    window.addEventListener("keydown", (event) => {
      if (!this.isGameRunning)
      return;

      switch (event.key) {
        case "w":
          socket.sendPaddleUp(false);
          break;
        case "s":
          socket.sendPaddleDown(false);
          break;
        case "ArrowUp":
          socket.sendPaddleUp(true);
          break;
        case "ArrowDown":
          socket.sendPaddleDown(true);
          break;
        default:
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (!this.isGameRunning)
      return;

      switch (event.key) {
        case "w":
          socket.sendPaddleUpStop(false);
          break;
        case "s":
          socket.sendPaddleDownStop(false);
          break;
        case "ArrowUp":
          socket.sendPaddleUpStop(true);
          break;
        case "ArrowDown":
          socket.sendPaddleDownStop(true);
          break;
        default:
          break;
      }
    });
  },

  beforeUnmounted() {
    window.removeEventListener("keydown");
    window.removeEventListener("keyup");
  },
};
</script>

<style scoped>
/* Achtung: the field geometry is calculated in the backed, while we set absolute values in the styling, this will now work and needs to be fixed */
.container {
  position: relative;
  width: 800px;
  height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.background {
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0);
  box-sizing: border-box;
  border-top: 10px solid rgb(217, 217, 229);
  border-bottom: 10px solid rgb(217, 217, 229);
}

.mid-line {
  position: absolute;
  height: 400px;
  border-left: 4px dashed rgb(217, 217, 229);
  margin-left: 391px;
}

.bouncing-ball {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
}

.left-paddle {
  position: absolute;
  width: 10px;
  height: 100px;
  background-color: rgb(217, 217, 229);
  left: 10px;
  transition: top 0.1s; /* Add a transition for smoother movement */
}

.right-paddle {
  position: absolute;
  width: 10px;
  height: 100px;
  background-color: rgb(217, 217, 229);
  left: 780px;
  transition: top 0.1s; /* Add a transition for smoother movement */
}
</style>
