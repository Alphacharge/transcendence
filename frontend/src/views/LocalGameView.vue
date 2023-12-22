<template>
  <div class="top">
    <div class="btn-group">
      <button
        @click="startLocalGame()"
        :class="{ 'disabled-btn': isGameRunning }"
        class="btn btn-danger"
      >
        {{ $t("StartLocalGame") }}
      </button>
    </div>
    <ScoreBoard :scoreEnabled="false"></ScoreBoard>
    <div class="game-wrapper">
      <GameArea class="game-area"></GameArea>
      <CountDown v-if="isGameRunning"></CountDown>
    </div>
    <div class="explanation-wrapper">
      <div class="explanation-left">
        {{ $t("LocalGameExplanationLeft") }}
      </div>
      <div class="explanation-right">
        {{ $t("LocalGameExplanationRight") }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  connectWebSocket,
  disconnectWebSocket,
  socket,
} from "@/assets/utils/socket";
import CountDown from "@/components/CountDown.vue";
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";

export default {
  components: { CountDown, ScoreBoard, GameArea },

  data() {
    return {
      isGameRunning: false,
    };
  },

  mounted() {
    connectWebSocket();

    socket.on("victory", () => {
      this.isGameRunning = false;
    });
  },

  beforeUnmount() {
    disconnectWebSocket();
  },

  methods: {
    async startLocalGame() {
      if (!this.isGameRunning) {
        this.isGameRunning = true;
        await socket.startLocalGame();
      }
    },
  },
};
</script>

<style scoped>
.disabled-btn {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-group {
  width: 100%;
}

.btn-danger {
  border: 0;
  background-color: #35b522;
}

.btn:hover {
  background-color: rgb(217, 217, 229);
  opacity: 0.5;
}

.game-wrapper {
  position: relative;
}

.top {
  margin-top: 4em;
}

.explanation-wrapper {
  width: 800px;
  margin: 0 auto;
  margin-top: 1em;
  color: rgb(217, 217, 229);
  display: flex;
}
.explanation-left {
  text-align: left;
  flex: 1;
}

.explanation-right {
  text-align: right;
  flex: 1;
}
</style>
