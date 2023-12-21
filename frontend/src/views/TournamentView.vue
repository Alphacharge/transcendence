<template>
  <div class="top">
    <div v-if="!inActiveTournament">
      <PlayerCheckin />
    </div>
    <PlayersComponent :inActiveTournament="inActiveTournament" />
  </div>
  <ScoreBoard v-if="inActiveTournament" :scoreEnabled="true"></ScoreBoard>
  <div class="game-wrapper">
    <GameArea></GameArea>
    <CountDown v-if="inActiveTournament"></CountDown>
  </div>
  <div class="explanation">
    {{ $t("LocalGameExplanationLeft") }}
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

    socket.on("addedToTournamentQueue", () => {
      this.iAmRegistered = true;
    });

    socket.on("removedFromTournamentQueue", () => {
      this.iAmRegistered = false;
    });
  },
};
</script>

<style scoped>
.game-wrapper {
  position: relative;
}

.top {
  margin-top: 4em;
}

.explanation {
  width: 800px;
  margin: 0 auto;
  margin-top: 1em;
  color: rgb(217, 217, 229);
  text-align: center;
}
</style>
