<template>
  <PlayerCheckin v-if="!inActiveTournament" />
  <TournamentArray></TournamentArray>
  <div>
    <h3>{{ $t("RegisteredPlayers") }}:</h3>
    <!-- REPLACE with player boxes -->
    <p v-for="(player, index) in players" :key="index">
      {{ player }}
    </p>
  </div>
  <p v-for="(winner, index) in winners" :key="index">
    Game {{ index + 1 }} winner: {{ winner }}
  </p>
  <div v-if="tournamentWinner">
    <p>Tournament Winner: {{ tournamentWinner }}</p>
  </div>
  <ScoreBoard></ScoreBoard>
  <div class="game-wrapper">
    <GameArea></GameArea>
    <CountDown v-if="inActiveTournament"></CountDown>
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
      winners: [],
      inActiveTournament: false,
      iAmRegistered: false,
      tournamentWinner: "",
    };
  },

  beforeUnmount() {
    disconnectWebSocket();
  },

  mounted() {
    connectWebSocket();

    socket.requestTournamentInfo();

    socket.on("tournamentStart", () => {
      this.inActiveTournament = true;
    });

    socket.on("tournamentReset", () => {
      // if i am not part of the running tournament, reset everything
      if (!this.iAmRegistered) {
        this.players.length = 0;
      }
    });

    socket.on("playerJoinedTournament", (username) => {
      if (this.inActiveTournament) {
        return;
      }

      if (!this.players.includes(username)) {
        this.players.push(username);
      }
    });

    socket.on("playerLeftTournament", (username) => {
      if (this.inActiveTournament) {
        return;
      }

      const index = this.players.indexOf(username);
      if (index !== -1) {
        this.players.splice(index, 1);
      }
    });

    socket.on("addedToTournamentQueue", () => {
      this.iAmRegistered = true;
    });

    socket.on("removedFromTournamentQueue", () => {
      this.iAmRegistered = false;
    });

    socket.on("victoryOf", (username) => {
      this.winners.push(username);
    });

    socket.on("tournamentWinner", (username) => {
      this.tournamentWinner = username;
    });
  },
};
</script>

<style>
.game-wrapper {
  position: relative;
}
</style>
