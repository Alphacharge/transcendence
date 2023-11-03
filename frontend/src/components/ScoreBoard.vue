<template>
  <div>
    <div class="player-score">Player 1: {{ player1Score }}</div>
    <div class="player-score">Player 2: {{ player2Score }}</div>
  </div>
</template>

<script>
export default {
  props: {
    player1Score: Number,
    player2Score: Number,
  },
};
</script>
