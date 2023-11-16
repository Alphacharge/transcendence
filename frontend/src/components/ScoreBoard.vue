<template>
  <div class="scoreboard">
    <h2 v-if="announceVisible" class="announce-winner">
      Player {{ winningPlayer }} Wins!
    </h2>
  </div>
  <div>
    <div class="player-score">
      <h5>Player 1 : {{ player1Score }}</h5>
    </div>
    <div class="player-score">
      <h5>Player 2 : {{ player2Score }}</h5>
    </div>
  </div>
</template>

<script>
import { socket } from "@/assets/utils/socket";
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
      this.winningPlayer = payload.id;
      console.log("Victory payload:", payload);
    });
  },
};
</script>
