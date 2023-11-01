<template>
  <div class="container">
    <div class="hinter-grund" ref="container"></div>
    <div class="bouncing-ball" :style="{ top: `${bouncingBallY}px`, left: `${bouncingBallX}px` }"></div>
    <div class="paddle" :style="{ top: `${paddleY}px` }"></div>
  </div>
</template>


<script>
  export default {
    props: ['pongTestPaddleBouncing'],
    data() {
      return {
        // abll and paddle starting positions
        bouncingBallX: 500,
        bouncingBallY: 250,
        paddleY: 200,
        animationFrameId: null,
      }
    },
    computed: {
      randomAngle() {
        let angle = 0;
        let p = Math.PI;
        // let angle = pi/2;
        do {
          angle = Math.random() * 2 * p;
          // repeat until computed value ca. +-10% away from horizontal and +-30% vertical axes
        } while (angle < 0.1 * p || (angle > 0.9 * p && angle<1.1 * p) || angle > 1.9 * p || (angle > .7 * p / 2 && angle < 1.3 * p / 2) || (angle >.7 * 3/2*p&&angle < 1.3*3/2*p));
        return  angle; }
    },
    created() {
      // Ball's starting direction
      const speedFactor = 4;
      this.speedX = Math.cos(this.randomAngle) * speedFactor;
      this.speedY = Math.sin(this.randomAngle) * speedFactor;
    },
    mounted() {
    // Start the autonomous movement
    // using requestAnimationFrame instead of setInterval
      this.animateBall();
    // Add event listeners for keydown events
      window.addEventListener("keydown", (event) => {
      if (event.key === "w") {
        // this.movePaddleUp();
      } else if (event.key === "s") {
        this.movePaddleDown();
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
      movePaddleUp() {
        if (this.paddleY > 10) {
          this.paddleY -= 10;
        }
      },
      movePaddleDown() {
        const container = this.$refs.container;
        if (this.paddleY < container.clientHeight - 90) {
          this.paddleY += 10;
        }
      },
      animateBall() {
        const container = this.$refs.container;

        const ballLeft = this.bouncingBallX - 5;
        const ballRight = this.bouncingBallX + 5;
        const ballTop = this.bouncingBallY - 5;
        const ballBottom = this.bouncingBallY + 5;
        // Check for collision with square borders
        if (ballLeft <= 5 || ballRight >= container.clientWidth + 10) {
          console.log("Touched", ballLeft, ballRight, container.clientWidth);
          this.speedX = -this.speedX; // Reverse X direction
        }
        if (ballTop <=1 || ballBottom >= container.clientHeight +9) {
          this.speedY = -this.speedY; // Reverse Y direction
        }

        // Calculate paddle boundaries
        const paddleLeft = 100; // Adjust this value based on your paddle's initial position
        const paddleRight = paddleLeft + 10; // Paddle width
        const paddleTop = this.paddleY;
        const paddleBottom = this.paddleY + 100; // Paddle height

        // Check for collision with the paddle
        if (
          ballRight > paddleLeft -5 &&
          ballLeft < paddleRight - 5 &&
          ballBottom > paddleTop &&
          ballTop < paddleBottom - 5
        ) {
          console.log(ballTop, paddleBottom);
          this.speedX = -this.speedX;
        }

        // Update the ball's position
        this.bouncingBallX += this.speedX;
        this.bouncingBallY += this.speedY;

        // Request the next animation frame
        this.animationFrameId = requestAnimationFrame(this.animateBall);
      },
    },
  };
</script>

<style>
  .container {
    position: relative;
    width: 1000px;
    height: 500px;
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
    left: 100px;
    transition: top 0.1s; /* Add a transition for smoother movement */
  }
</style>
