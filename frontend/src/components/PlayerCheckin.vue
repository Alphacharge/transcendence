<template>
  <div class="player-checkin">
    <div class="btn-group">
      <button
        v-if="!iAmRegistered"
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
      iAmRegistered: false,
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
      this.iAmRegistered = true;
    });

    socket.on("removedFromTournamentQueue", () => {
      this.iAmRegistered = false;
    });

    socket.on("tournamentReset", () => {
      this.playersInTournament = 0;
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
