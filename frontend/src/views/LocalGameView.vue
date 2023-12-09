<template>
  <p>{{ $t("LocalGameExplanation") }}</p>
  <div>
    <button @click="startLocalGame()">{{ $t("StartLocalGame") }}</button>
  </div>
  <CountDown></CountDown>
  <ScoreBoard></ScoreBoard>
  <GameArea :isLocalGame="true"></GameArea>
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

  mounted() {
    connectWebSocket();
  },

  beforeUnmount() {
    disconnectWebSocket();
  },

  methods: {
    async startLocalGame() {
      await socket.startLocalGame();
    },
  },
};
</script>
