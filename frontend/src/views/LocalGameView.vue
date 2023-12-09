<template>
  <p>{{ $t("LocalGameExplanation") }}</p>
  <div>
    <button @click="startLocalGame()">{{ $t("StartLocalGame") }}</button>
  </div>
  <ScoreBoard></ScoreBoard>
  <div class="game-wrapper">
    <GameArea
    class="game-area"
    :isLocalGame="true"
    ></GameArea>
    <CountDown
      v-if="countDownVisible"
    ></CountDown>
  </div>
</template>

<script>
import { connectWebSocket, socket } from "@/assets/utils/socket";
import CountDown from "@/components/CountDown.vue";
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";

export default {
  components: { CountDown, ScoreBoard, GameArea },
  data() {
    return {
      countDownVisible: false,
    }
  },
  methods: {
    async startLocalGame() {
      this.countDownVisible=true;
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
</style>
