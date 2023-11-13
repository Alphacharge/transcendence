<template>
  <div class="player-checkin">
    <h5>Players ready: {{ numberOfPlayers }}</h5>
    <button @click="checkIn" class="press-checkin">{{ btnMsg }}</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkMsg: "Free Place",
      btnMsg: "Check-in",
      checkStatus: false,
      numberOfPlayers: 0,
      newPlayername: "Add Test",
      newPlayerUniqueId: "100",
    };
  },
  methods: {
    checkIn() {
      if (!this.checkStatus) {
        this.checkStatus = !this.checkStatus;
        this.numberOfPlayers = this.getNumberofPlayers();
        this.btnMsg = " Leave ";
      }
    },

    async addPlayer() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playerName: this.newPlayerName,
              playerUniqueId: this.newPlayerUniqueId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Refresh the number of players after adding a new player
        await this.getNumberOfPlayers();

        // Clear the form fields
        this.newPlayerName = "";
        this.newPlayerUniqueId = "";
      } catch (error) {
        console.error("Error adding player:", error.message);
      }
    },
    async getNumberofPlayers() {
      try {
        // console.log(`ENV:${VUE_APP_BACKEND_IP}`);
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/all`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        this.numberOfPlayers = data.length;
      } catch (error) {
        console.error("Error fetching number of players:", error.message);
      }
    },
  },
};
</script>
