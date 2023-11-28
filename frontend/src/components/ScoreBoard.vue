<template>
  <div class="scoreboard">
    <h2 v-if="announceVisible" class="announce-winner">
      Player {{ winningPlayer }} Wins!
    </h2>
    <div class="player-score">
      <h5>{{ player1Score }} : {{ player2Score }}</h5>
    </div>
  </div>
</template>

<script>
import { socket } from "@/assets/utils/socket";

export default {
  data() {
    return {
      announceVisible: false,
      player1Score: 0,
      player2Score: 0,
      winningPlayer: "",
    };
  },

  mounted() {
    socket.on("scoreUpdate", (playerScores) => {
      this.player1Score = playerScores.player1;
      this.player2Score = playerScores.player2;
    });

    socket.on("victory", (payload) => {
      this.announceVisible = true;
      this.winningPlayer = payload;
      console.log("Victory payload:", payload);
    });

    // received info if we are left or right
    socket.on("player1", () => {
      this.player1Score = 0;
    });
    socket.on("player2", () => {
      this.player2Score = 0;
    });
  },
};
</script>
