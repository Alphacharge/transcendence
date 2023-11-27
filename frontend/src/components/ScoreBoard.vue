<template>
  <div class="scoreboard">
    <h2 v-if="announceVisible" class="announce-winner">
      Player {{ winningPlayer }} Wins!
    </h2>
    <div class="player-score">
      <h5>{{ playerName }} : {{ playerScore }}</h5>
    </div>
  </div>
</template>

<script>
import { socket } from "@/assets/utils/socket";

export default {
  props: {
    playerScore: Number,
    playerName: String,
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
    });
  },
};
</script>

