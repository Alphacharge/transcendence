<template>
  <div class="top">
    <RemoteGameButtons />
    <ScoreBoard :scoreEnabled="true" />
    <div class="game-wrapper">
      <GameArea></GameArea>
      <CountDown v-if="countDownVisible" />
    </div>
    <div class="explanation">
        {{ $t("LocalGameExplanationLeft") }}
    </div>
  </div>
</template>

<script>
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import RemoteGameButtons from "@/components/RemoteGameButtons.vue";
import CountDown from "@/components/CountDown.vue";
import {
  connectWebSocket,
  disconnectWebSocket,
  socket,
} from "@/assets/utils/socket";

export default {
  data() {
    return {
      countDownVisible: false,
    };
  },
  components: { GameArea, ScoreBoard, RemoteGameButtons, CountDown },

  mounted() {
    connectWebSocket();
    socket.on("prepareGame", () => {
      this.countDownVisible = true;
    });
  },

  beforeUnmount() {
    disconnectWebSocket();
  },
};
</script>

<style scoped>
.game-wrapper {
  position: relative;
}

.top {
  margin-top: 4em;
}

.explanation {
  width: 800px;
  margin: 0 auto;
  margin-top: 1em;
  color: rgb(217, 217, 229);
  text-align: center;
}
</style>
