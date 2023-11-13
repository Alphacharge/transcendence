<template>
  <div class="player-checkin">
    <h5>Places available in this tournament: {{ 4 - playersInTournament }}</h5>
    <p v-if="participateStatus">You are checked in this tournament</p>
    <button @click.prevent="checkIn" class="add-player">{{ btnMsg }}</button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        btnMsg: 'Participate',
        participateStatus: false,
        playersInTournament: 0,
      }
    },
    async mounted() {
      this.playersInTournament = await this.countPlayers();
      this.participateStatus = await this.checkMyStatus();
      if(this.participateStatus)
        this.btnMsg = "Leave Tournament";
      else
        this.btnMsg = "Participate";
    },
    methods: {
      async checkIn() {
        this.participateStatus = await this.checkMyStatus;
        if(!this.participateStatus)
        {
          await this.addPlayer();
          this.btnMsg = "Leave Tournament";
        }
        else
        {
          await this.removePlayer();
          this.btnMsg = "Participate";
        }
        this.playersInTournament = await this.countPlayers;
      },
      retrieveToken() {
        const storedPlayerToken = localStorage.getItem('userData');
        console.log(storedPlayerToken);
        if (!storedPlayerToken) {
          console.error('Player token not found in local storage');
          return -1;
        }
        return storedPlayerToken;
      },
      async addPlayer() {
        const storedPlayerToken = this.retrieveToken();
        if(this.participateStatus || storedPlayerToken === -1) {
          return;
        }
        try {
          const response = await fetch(`http://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              playerToken: storedPlayerToken,
            }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          return data["response"];
        } catch (error)
        {
          console.error('Error adding player:', error);
        }
      },
      async removePlayer() {
        const storedPlayerToken = this.retrieveToken();
        if(!this.participateStatus || storedPlayerToken === -1)
          return;
        try {
            const response = await fetch(`http://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/${storedPlayerToken}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data["response"];
          } catch (error)
          {
            console.error('Error deleting player:', error);
          }
      },
      async countPlayers() {
        try {
            const response = await fetch(`http://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/count`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data["response"];
            } catch (error) {
            console.error('Error getting players in tournament:', error);
          }
      },
      async checkMyStatus() {
        const storedPlayerToken = this.retrieveToken();
        if (storedPlayerToken === -1)
          return;
        try {
          const response = await fetch(`http://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerToken: storedPlayerToken,
              }),
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          return data["response"];
        } catch (error) {
            console.error('Error adding player:', error);
        }
      },
    },
  }
  </script>
