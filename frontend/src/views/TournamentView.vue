<template>
  <div class="top">
    <div v-if="playerCheckinVisible && players.length < 4">
      <PlayerCheckin />
    </div>
    <PlayersComponent v-if="!countDownVisible" :players="players"/>
  </div>
  <ScoreBoard v-if="tournamentStarted" :scoreEnabled="true"></ScoreBoard>
  <div class="game-wrapper">
    <GameArea></GameArea>
    <CountDown v-if="countDownVisible"></CountDown>
  </div>
</template>

<script>
import {
  socket,
  connectWebSocket,
  disconnectWebSocket,
} from "@/assets/utils/socket";
import CountDown from "@/components/CountDown.vue";
import GameArea from "@/components/GameArea.vue";
import PlayerCheckin from "@/components/PlayerCheckin.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import PlayersComponent from "@/components/PlayersComponent.vue";

export default {
  components: {
    PlayerCheckin,
    GameArea,
    ScoreBoard,
    CountDown,
    PlayersComponent,
  },
  data() {
    return {
      players: [],
      tournamentStatus: 1, // status: 2: round 1, 4: round 2, 8: finished
      playerCheckinVisible: true,
      countDownVisible: false,
      tournamentStarted: false,
    };
  },

  beforeUnmount() {
    disconnectWebSocket();
  },

  mounted() {
    connectWebSocket();

    socket.requestTournamentInfo();

    socket.on("tournamentStart", () => {
      // INSERT remove all parts of the interface you don't want to show during a tournament
      this.countDownVisible = true;
      this.playerCheckinVisible = false;
      this.tournamentStarted = true;
    });

    socket.on("playerJoinedTournament", (user) => {
      if (!this.players.some(player => player.id == user.id)) {
        this.players.push(user);
      }
    });
    socket.on("playerLeftTournament", (userId) => {
      const index = this.players.findIndex(player => player.id === userId);
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

.top {
  margin-top: 4em;
}
</style>
