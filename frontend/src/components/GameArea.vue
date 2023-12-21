<template>
  <div class="field">
    <div class="left-paddle" :style="{ top: `${leftPaddleY}px` }"></div>
    <div class="right-paddle" :style="{ top: `${rightPaddleY}px` }"></div>
    <div class="container">
      <!-- <div class="background" ref="container"></div> -->
      <div class="mid-line"></div>
      <div
        class="bouncing-ball"
        :style="{ top: `${bouncingBallY}px`, left: `${bouncingBallX}px` }"
      ></div>
    </div>
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
      bouncingBallX: 395,
      bouncingBallY: 195,
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
      if (!this.isGameRunning) return;

      switch (event.key) {
        case "w":
          socket.sendPaddleUp(false);
          break;
        case "s":
          socket.sendPaddleDown(false);
          break;
        case "ArrowUp":
          if (this.isLocalGame) socket.sendPaddleUp(true);
          break;
        case "ArrowDown":
          if (this.isLocalGame) socket.sendPaddleDown(true);
          break;
        default:
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (!this.isGameRunning) return;

      switch (event.key) {
        case "w":
          socket.sendPaddleUpStop(false);
          break;
        case "s":
          socket.sendPaddleDownStop(false);
          break;
        case "ArrowUp":
          if (this.isLocalGame) socket.sendPaddleUpStop(true);
          break;
        case "ArrowDown":
          if (this.isLocalGame) socket.sendPaddleDownStop(true);
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

.field {
  position: relative;
  width: 820px;
  height: 420px;
  margin: 0 auto;
  border-top: 10px solid rgb(217, 217, 229);
  border-bottom: 10px solid rgb(217, 217, 229);
}

.container {
  position: relative;
  background-color: rgba(128, 128, 128, 0.1);
  /* display: flex;
  align-items: center; */
  width: 800px;
  height: 400px;
  overflow: hidden;
  /* border: 1px solid red; */
}

.mid-line {
  position: absolute;
  height: 400px;
  border-left: 4px dashed rgb(217, 217, 229);
  margin-left: 386px;
}

.bouncing-ball {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: rgb(217, 217, 229);
  border-radius: 50%;
}

.left-paddle {
  position: absolute;
  width: 10px;
  height: 100px;
  background-color: rgb(217, 217, 229);
  left: 0px;
}

.right-paddle {
  position: absolute;
  width: 10px;
  height: 100px;
  background-color: rgb(217, 217, 229);
  left: 810px;
}
</style>
