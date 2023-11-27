<template>
  <div>
    <p>I am player number: {{ playerNumber }}</p>
  </div>
  <CountDown />
  <PongButtons />
  <ScoreBoard />
  <GameArea :player-number="playerNumber"></GameArea>
</template>

<script>
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import PongButtons from "@/components/PongButtons.vue";
import CountDown from "@/components/CountDown.vue";
import { connectWebSocket, socket } from "@/assets/utils/socket";

export default {
  components: { GameArea, ScoreBoard, PongButtons, CountDown },

  mounted() {
    connectWebSocket();

    // received info if we are left or right
    socket.on("player1", () => {
      this.playerNumber = 1;
      this.player1Score = 0;
    });
    socket.on("player2", () => {
      this.playerNumber = 2;
      this.player2Score = 0;
    });
  },

  methods: {
    enterQueue() {
      socket.enterQueue();
    },
    leaveQueue() {
      socket.leaveQueue();
    },
  },
};
</script>
