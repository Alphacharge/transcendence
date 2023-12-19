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
      // animationFrameId: null,
      // player1up: false,
      // player1down: false,
      // player2up: false,
      // player2down: false,
    };
  },

  mounted() {
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

    const keyState = {};
    // send paddle movement messages
    window.addEventListener("keydown", (event) => {
      event.preventDefault();

      switch (event.key) {
        case "w":
          // this.player1up = true;
          socket.sendPaddleUp(false);
          break;
        case "s":
          // this.player1down = true;
          socket.sendPaddleDown(false);
          break;
        case "ArrowUp":
          // if (this.isLocalGame) this.player2up = true;
          socket.sendPaddleUp(true);
          break;
        case "ArrowDown":
          // if (this.isLocalGame) this.player2down = true;/
          socket.sendPaddleDown(true);
          break;
        default:
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "w":
          // this.player1up = false;
          socket.sendPaddleUpStop(false);
          break;
        case "s":
          // this.player1down = false;
          socket.sendPaddleDownStop(false);
          break;
        case "ArrowUp":
          // if (this.isLocalGame) this.player2up = false;
          socket.sendPaddleUpStop(true);
          break;
        case "ArrowDown":
          // if (this.isLocalGame) this.player2down = false;
          socket.sendPaddleDownStop(true);
          break;
        default:
          break;
      }
    });

    // this.animate();
  },

  beforeUnmounted() {
    // if (this.animationFrameId) {
    //   cancelAnimationFrame(this.animationFrameId);
    // }

    window.removeEventListener("keydown");
    window.removeEventListener("keyup");
  },

  methods: {
    // animate() {
    //   let lastTimestamp = 0;
    //   const animateFrame = (timestamp) => {
    //     const delta = timestamp - lastTimestamp; // Calculate time elapsed since the last frame
    // const interval = 1000 / 30; // Update at 30 frames per second (adjust as needed)
    // if (delta >= interval) {
    //   // Perform updates here based on the elapsed time
    //   lastTimestamp = timestamp;
    //   // received ball update from server
    //   if (this.player1up) socket.sendPaddleUp("left");
    //   if (this.player1down) socket.sendPaddleDown("left");
    //   if (this.player2up) socket.sendPaddleUp("right");
    //   if (this.player2down) socket.sendPaddleDown("right");
    // }
    //   this.animationFrameId = requestAnimationFrame(animateFrame);
    //   };
    //   animateFrame();
    // },
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
