<template>
  <div>
  <div class="btn-group">
    <button @click="createGame()" class="btn btn-danger">
      {{ $t("ApiTestCreate") }}
    </button>
    <button @click="leftUp()" class="btn btn-danger">
      {{ $t("ApiTestLeftUp") }}
    </button>
    <button @click="leftDown()" class="btn btn-danger">
      {{ $t("ApiTestLeftDown") }}
    </button>
    <button @click="rightUp()" class="btn btn-danger">
      {{ $t("ApiTestRightUp") }}
    </button>
    <button @click="rightDown()" class="btn btn-danger">
      {{ $t("ApiTestRightDown") }}
    </button>
    <button @click="updateGame()" class="btn btn-danger">
      {{ $t("ApiTestUpdate") }}
    </button>
  </div>
  <div class="field-paddles">
    <div class="left-paddle" :style="{ top: `${leftPaddleY}px` }"></div>
    <div class="right-paddle" :style="{ top: `${rightPaddleY}px` }"></div>
    <div class="field-ball">
      <div class="mid-line"></div>
      <div
        class="bouncing-ball"
        :style="{ top: `${bouncingBallY}px`, left: `${bouncingBallX}px` }"
      ></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      gameData: null,
      bouncingBallX: 395,
      bouncingBallY: 195,
      leftPaddleY: 150,
      rightPaddleY: 150,
    };
  },

  methods: {
    async createGame() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/game/initialize`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );
          console.log(response);
        if (response.ok) {
          const data = await response.json();
          this.gameData = data;
        } else {
          console.error("Failed to fetch Game Init");
        }
      } catch (error) {
        console.error("Error fetching Game Init:", error);
      }
    },
    async movePaddle(direction){
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/game/paddle/${direction}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.gameData),
          },
        );

        if (response.ok) {
          const data = await response.json();
          this.gameData = data;
          this.updateData();
        } else {
          console.error(`Failed to fetch ${direction}`);
        }
      } catch (error) {
        console.error(`Error fetching ${direction}:`, error);
      }
    },
    async leftUp() {
      await this.movePaddle('leftPaddleUp');
    },
    async leftDown() {
      await this.movePaddle('leftPaddleDown');
    },
    async rightUp() {
      await this.movePaddle('rightPaddleUp');
    },
    async rightDown() {
      await this.movePaddle('rightPaddleDown');
    },
    async updateGame() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/game/update`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.gameData),
          },
        );

        if (response.ok) {
          const data = await response.json();
          this.gameData = data;
          this.updateData();
        } else {
          console.error("Failed to fetch Update Game");
        }
      } catch (error) {
        console.error("Error fetching Update Game:", error);
      }
    },
    updateData() {
      this.bouncingBallX = this.gameData.ballX;
      this.bouncingBallY = this.gameData.ballY;
      this.leftPaddleY = this.gameData.leftPaddle;
      this.rightPaddleY = this.gameData.rightPaddle;
    },
  },
};
</script>

<style scoped>
.field-paddles {
  position: relative;
  width: 820px;
  height: 420px;
  margin: 0 auto;
  border-top: 10px solid rgb(217, 217, 229);
  border-bottom: 10px solid rgb(217, 217, 229);
  overflow: hidden;
  box-sizing: border-box;
}

.field-ball {
  position: relative;
  background-color: rgba(128, 128, 128, 0.1);
  margin: 0 auto;
  width: 800px;
  height: 400px;
  overflow: hidden;
}

.mid-line {
  position: relative;
  height: 100%;
  width: 0px;
  border-right: 4px dashed rgb(217, 217, 229);
  margin: 0 auto;
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
.btn-group {
  margin-top: 4em;
  width: 100%;
}
.btn-danger {
  width: 90%;
  border: 0;
  background-color: #35b522;
}
</style>
