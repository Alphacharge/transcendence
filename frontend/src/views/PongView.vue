<template>
  <PongButtons />
  <ScoreBoard />
  <div class="game-wrapper">
    <GameArea></GameArea>
    <CountDown
    v-if="countDownVisible" />
  </div>
</template>

<script>
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import PongButtons from "@/components/PongButtons.vue";
import CountDown from "@/components/CountDown.vue";
import { connectWebSocket, disconnectWebSocket } from "@/assets/utils/socket";

export default {
  components: { GameArea, ScoreBoard, PongButtons, CountDown },

  mounted() {
    connectWebSocket();
  },

  beforeUnmount() {
    disconnectWebSocket();
  },
};
</script>

<style>
.game-wrapper {
  position: relative;
}
</style>
