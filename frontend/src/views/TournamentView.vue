<template>
  <div>
    <h2>Tournament Players</h2>
    <div>
      <PlayerCheckin @playerCountChanged="fetchPlayers"/>
    </div>
    <div v-if="players.length > 0">
      <h3>Players waiting to play</h3>
      <p v-for="(player, index) in players" :key="index">Player {{ index + 1 }} {{ player }}</p>
    </div>
    <div v-else>
      <p>No players available yet.</p>
    </div>
  </div>
</template>
<script>

import PlayerCheckin from '@/components/PlayerCheckin.vue';

export default {
  // computed: {
  //   async displayPlayers() {
  //     return this.players;
  //   }
  // },
  components: {
    PlayerCheckin
  },
  data() {
    return {
      players: [],
    }
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    async fetchPlayers() {
      console.log("fetchPlayers fired");
      try {
        const response = await fetch(`http://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.players = await data["response"];
        console.log(this.players);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    },
  },
};
</script>
