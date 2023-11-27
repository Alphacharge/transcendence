<template>
  <div>
    <p>Game ID: {{ gameId }}</p>
    <p>I am player number: {{ playerNumber }}</p>
  </div>
  <CountDown />
  <PongButtons />
  <ScoreBoard />
  <GameArea :gameId="gameId" :player-number="playerNumber"></GameArea>
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

    socket.on("connect", () => {
      // received new game ID from server
      socket.on("gameId", (payload) => {
        this.gameId = payload.gameId;
        this.player1Score = 0;
        this.player2Score = 0;
      });

      // received info if we are left or right
      socket.on("player1", () => {
        this.playerNumber = 1;
      });
      socket.on("player2", () => {
        this.playerNumber = 2;
      });
    });
  },
  methods: {
    enterQueue() {
      socket.enterQueue();
    },
    leaveQueue() {
      socket.leaveQueue();
    },
    stopGame() {
      socket.stopGame(this.gameId);
    },
  },
};
</script>
