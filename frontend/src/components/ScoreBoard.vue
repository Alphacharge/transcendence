<template>
  <div class="scoreboard">
    <div class="announce-winner" v-if="announceVisible">
      {{ $t("Player") }} {{ winningPlayer }} {{ $t("wins") }}!
    </div>
    <div class="game-score">{{ player1Score }}:{{ player2Score }}</div>
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
    });

    // reset values
    socket.on("addedToQueue", () => {
      this.announceVisible = false;
      this.player1Score = 0;
      this.player2Score = 0;
      this.winningPlayer = "";
    });
    socket.on("countDown", () => {
      this.announceVisible = false;
      this.player1Score = 0;
      this.player2Score = 0;
      this.winningPlayer = "";
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

<style>
.game-score {
  margin-left: 0.1em;
  text-align: center;
  font-size: 7em;
  color: rgb(217, 217, 229);
}

.announce-winner {
  color: rgb(217, 217, 229);
  text-align: center;
  font-size: 7em;
}
</style>
