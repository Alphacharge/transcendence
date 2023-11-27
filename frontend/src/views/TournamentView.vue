<template>
  <div>
    <h2>Tournament Players</h2>
    <div v-if="testButtonVisible">
      <button class="test-btn" @click.prevent="startTournament">
        Test Start
      </button>
    </div>
    <div v-if="players.length < 4">
      <PlayerCheckin @playerCountChanged="fetchPlayers" />
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
  <GameArea></GameArea>
</template>

<script>
import { connectWebSocket } from "@/assets/utils/socket";
import GameArea from "@/components/GameArea.vue";
import PlayerCheckin from "@/components/PlayerCheckin.vue";

export default {
  components: {
    PlayerCheckin,
    GameArea,
  },
  data() {
    return {
      players: [],
      tournamentStatus: 1, // status: 2: round 1, 4: round 2, 8: finished
      // pongVisible: false,
      pongVisible: true,
      playerCheckinVisible: true,
      testButtonVisible: false,
    };
  },
  mounted() {
    connectWebSocket();
    this.fetchPlayers();
  },
  methods: {
    async fetchPlayers() {
      // try {
      // socket.getPlayerCount();
      // const response = await fetch(
      //   `https://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/all`,
      //   {
      //     method: "GET",
      //     headesr: {
      //       "Content-Type": "application/json",
      //     },
      //   },
      // );
      // if (!response.ok) {
      //   throw new Error(`HTTPS error! Status: ${response.status}`);
      // }
      // const data = await response.json();
      // this.players = await data["response"];
      // if (this.players.length === 4) {
      //   this.startTournament();
      // }
      // } catch (error) {
      //   console.error("Error fetching players:", error);
      // }
      // },
      // async startTournament() {
      //   this.countDownVisible = true;
      // if (this.tournamentStatus < 4) {
      //   this.tournamentStatus = this.tournamentStatus << 1;
      //   this.pongVisible = true;
      // socket.enterTournamentQueue(this.tournamentStatus);
      // } else {
      //   console.error(
      //     `unexpected tournament status value : ${this.tournamentStatus}`,
      //   );
      // }
    },
  },
};
</script>
