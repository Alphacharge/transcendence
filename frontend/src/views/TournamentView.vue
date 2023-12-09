<template>
  <div>
    <h2>Tournament Players</h2>
    <div v-if="testButtonVisible">
      <button class="test-btn" @click.prevent="startTournament">
        Test Start
      </button>
    </div>
    <div v-if="playerCheckinVisible && players.length < 4">
      <PlayerCheckin />
    </div>
    <div v-else>
      <h3>Get Ready to Play...</h3>
    </div>
    <div v-if="players.length > 0 && players.length < 4">
      <h3>Players waiting to play</h3>
      <p v-for="(player, index) in players" :key="index">
        Player {{ index + 1 }} {{ player }}
      </p>
    </div>
    <div v-else>
      <p>No players available yet.</p>
    </div>
  </div>
  <ScoreBoard></ScoreBoard>
  <div class="game-wrapper">
    <GameArea></GameArea>
    <CountDown
    v-if="countDownVisible"
    ></CountDown>
  </div>
</template>

<script>
import { socket, connectWebSocket } from "@/assets/utils/socket";
import CountDown from "@/components/CountDown.vue";
import GameArea from "@/components/GameArea.vue";
import PlayerCheckin from "@/components/PlayerCheckin.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";

export default {
  components: {
    PlayerCheckin,
    GameArea,
    ScoreBoard,
    CountDown,
  },
  data() {
    return {
      players: [],
      tournamentStatus: 1, // status: 2: round 1, 4: round 2, 8: finished
      playerCheckinVisible: true,
      testButtonVisible: false,
      countDownVisible: false,
    };
  },
  mounted() {
    connectWebSocket();

    socket.requestTournamentInfo();

    socket.on("tournamentStart", () => {
      // INSERT remove all parts of the interface you don't want to show during a tournament
      this.countDownVisible=true;
      this.playerCheckinVisible = false;
    });

    socket.on("playerJoinedTournament", (username) => {
      console.log("player joined tournament queue", username);
      if (!this.players.includes(username)) {
        this.players.push(username);
      }
    });

    socket.on("playerLeftTournament", (username) => {
      const index = this.players.indexOf(username);
      if (index !== -1) {
        this.players.splice(index, 1);
      }
    });
  },
};
</script>

<style>
.game-wrapper {
  position: relative;
}
</style>
