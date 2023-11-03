<template>
  <div class="scoreboard">
    <h2 v-if="announceVisible" class="announce-winner">
      {{ winningPlayer }} Wins!
    </h2>
    <div class="player-score">Player 1: {{ player1Score }}</div>
    <div class="player-score">Player 2: {{ player2Score }}</div>
  </div>
</template>

<script>
import { socket } from "../socket";
export default {
  props: {
    player1Score: Number,
    player2Score: Number,
  },
  data() {
    return {
      announceVisible: false,
      winningPlayer: "",
    };
  },
  mounted() {
    socket.on("victory", (payload) => {
      this.announceVisible = true;
      this.winningPlayer = payload;
      console.log("Victory payload:", payload);
    });
  },
};
</script>
