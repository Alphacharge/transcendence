<template>
  <div class="player-checkin">
    <h5>
      Waiting for {{ 4 - displayedPlayerCount }} other player(s) to start this
      tournament...
    </h5>
    <div class="btn-group">
      <button
        v-if="!participateStatus"
        @click="enterTournament()"
        class="btn btn-danger"
      >
        {{ $t("EnterTournament") }}
      </button>
      <button v-else @click="leaveTournament()" class="btn btn-warning">
        {{ $t("LeaveTournament") }}
      </button>
    </div>
  </div>
</template>
<script>
import { connectWebSocket, socket } from "@/assets/utils/socket";

export default {
  computed: {
    displayedPlayerCount() {
      return this.playersInTournament;
    },
  },

  data() {
    return {
      participateStatus: false,
      playersInTournament: 0,
    };
  },

  async mounted() {
    connectWebSocket();

    socket.requestTournamentInfo();

    socket.on("tournamentPlayerCount", (queueSize) => {
      this.playersInTournament = queueSize;
    });

    socket.on("addedToTournamentQueue", () => {
      this.participateStatus = true;
    });

    socket.on("removedFromTournamentQueue", () => {
      this.participateStatus = false;
    });
  },

  watch: {
    displayedPlayerCount(newValue) {
      this.$emit("playerCountChanged", newValue);
    },
  },

  methods: {
    enterTournament() {
      socket.enterTournamentQueue();
    },

    leaveTournament() {
      socket.leaveQueue();
    },
  },
};
</script>
