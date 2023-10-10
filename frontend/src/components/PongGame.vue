import ScoreBoard from './ScoreBoard.vue';
<template>
  <ScoreBoard :player1Score="player1Score" :player2Score="player2Score" />
  <GameArea></GameArea>
</template>

<script>
import GameArea from "./GameArea.vue";
import ScoreBoard from "./ScoreBoard.vue";
import { socket } from "../socket";

export default {
  data() {
    return {
      player1Score: 0,
      player2Score: 0,
    };
  },
  components: { GameArea, ScoreBoard },
  mounted() {
    // received score update from server
    socket.on("scoreUpdate", (playerScores) => {
      this.player1Score = playerScores.player1;
      this.player2Score = playerScores.player2;
    });
  },
};
</script>
