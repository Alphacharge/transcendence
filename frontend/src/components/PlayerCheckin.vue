<template>
  <div class="player-checkin">
    <h5>
      Waiting for {{ 4 - displayedPlayerCount }} other player(s) to start this
      tournament...
    </h5>
    <p v-if="participateStatus">You are checked in for this tournament!</p>
    <button @click.prevent="checkIn" class="add-player">{{ btnMsg }}</button>
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
      btnMsg: "Participate",
      participateStatus: false,
      playersInTournament: 0,
    };
  },
  async mounted() {
    socket.requestTournamentInfo();

    if (this.participateStatus) this.btnMsg = "Leave Tournament";
    else this.btnMsg = "Participate";

    socket.on("tournamentPlayerCount", (queueSize) => {
      this.playersInTournament = queueSize;
    });

    socket.on("addedToTournamentQueue", () => {
      this.participateStatus = true;
      this.btnMsg = "Leave Tournament";
    });

    socket.on("removedFromTournamentQueue", () => {
      this.participateStatus = false;
      this.btnMsg = "Participate";
    });
  },

  watch: {
    displayedPlayerCount(newValue) {
      this.$emit("playerCountChanged", newValue);
    },
  },

  methods: {
    async checkIn() {
      connectWebSocket();

      if (!this.participateStatus) {
        socket.enterTournamentQueue();
      } else {
        socket.leaveTournamentQueue();
      }
    },
  },
};
</script>
