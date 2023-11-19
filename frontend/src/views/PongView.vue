import ScoreBoard from './ScoreBoard.vue';
<template>
  <div>
    <p>Game ID: {{ gameId }}</p>
    <p>I am player number: {{ playerNumber }}</p>
  </div>
  <CountDown />
  <PongButtons v-if="pongButtonsVisible" />
  <ScoreBoard :player1Score="player1Score" :player2Score="player2Score" />
  <GameArea :gameId="gameId" :player-number="playerNumber"></GameArea>
</template>

<script>
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import PongButtons from "@/components/PongButtons.vue";
import CountDown from "@/components/CountDown.vue";
import { socket } from "@/assets/utils/socket";

export default {
  props: {
    pongButtonsVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      player1Score: 0,
      player2Score: 0,
      gameId: null,
      playerNumber: 0,
    };
  },
  components: { GameArea, ScoreBoard, PongButtons, CountDown },
  mounted() {
    // received new game ID from server
    socket.on("gameId", (payload) => {
      this.gameId = payload.gameId;
      this.player1Score = 0;
      this.player2Score = 0;
    });
    // received info if we are left or right
    // better name?
    socket.on("player1", () => {
      this.playerNumber = 1;
    });
    socket.on("player2", () => {
      this.playerNumber = 2;
    });
    // received score update from server
    socket.on("scoreUpdate", (playerScores) => {
      this.player1Score = playerScores.player1;
      this.player2Score = playerScores.player2;
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
