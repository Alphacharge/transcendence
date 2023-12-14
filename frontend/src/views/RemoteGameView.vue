<template>
  <div class="top">
    <RemoteGameButtons />
    <ScoreBoard :scoreEnabled="true" />
    <div class="game-wrapper">
      <GameArea></GameArea>
      <CountDown v-if="countDownVisible" />
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
      console.log("PEPAREGAME LISTENED");
      this.countDownVisible = true;
    });
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

.top {
  margin-top: 4em;
}
</style>
