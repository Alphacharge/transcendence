<template>
  <div>
    <h2>Tournament Players</h2>
    <div>
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
  <Pong v-if="pongVisible" :enterQueueVisibile="false" />
</template>
<script>
import PlayerCheckin from "@/components/PlayerCheckin.vue";
import { socket } from "@/assets/utils/socket";
import Pong from "@/views/PongView.vue";
export default {
  components: {
    PlayerCheckin,
    Pong,
  },
  data() {
    return {
      players: [],
      tournamentStatus: 0b000,
      pongVisible: false,
    };
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    async fetchPlayers() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/all`,
          {
            method: "GET",
            headesr: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTPS error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.players = await data["response"];
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    },
    async startTournament() {
      this.tournamentStatus = this.tournamentStatus << 1;
      this.pongVisible = true;
      socket.enterTournamentQueue();
    },
  },
};
</script>
