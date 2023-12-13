<template>
  <div class="top">
    <div class="btn-group">
      <button @click="startLocalGame()" class="btn btn-danger">
        {{ $t("StartLocalGame") }}
      </button>
    </div>
    <ScoreBoard :scoreEnabled="false"></ScoreBoard>
    <div class="game-wrapper">
      <GameArea class="game-area" :isLocalGame="true"></GameArea>
      <CountDown v-if="countDownVisible"></CountDown>
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
      countDownVisible: false,
    };
  },
  mounted() {
    connectWebSocket();
  },

  beforeUnmount() {
    disconnectWebSocket();
  },

  methods: {
    async startLocalGame() {
      this.countDownVisible = true;
      connectWebSocket();
      await socket.startLocalGame();
    },
  },
};
</script>

<style>
.game-wrapper {
  position: relative;
}

.top {
  margin-top: 4em;
}

.explanation-wrapper {
  margin: 0 20%;
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
