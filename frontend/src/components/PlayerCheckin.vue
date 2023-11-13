<template>
  <div class="player-checkin">
    <h5>Players in tournament: {{ 4 - playersInTournament }}</h5>
    <button @click.prevent="addPlayer" class="add-player">{{ btnMsg }}</button>
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
      try {
            const response = await fetch(`http://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/all`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            else
            {
              const data = await response.json();
              this.playersInTournament = data["response"];
            }
            } catch (error) {
            console.error('Error getting players in tournament:', error);
          }
    },
    methods: {
      async addPlayer() {
        /* get the bearer token from local storage and use is as unique player identifier */
        const storedPlayerToken = localStorage.getItem('userData');

        console.log(storedPlayerToken);
        if (!storedPlayerToken) {
          console.error('Player token not found in local storage');
          return;
        };
        /* try to add the player to the tournament queue with http post request acting the add method */
        if (!this.participateStatus) {
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
            else
            {
              const data = await response.json();
              this.playersInTournament = data["response"];
            }
            this.participateStatus = !this.participateStatus;
            this.btnMsg = 'Leave Tournament';
          } catch (error) {
            console.error('Error adding player:', error);
          }
        }
        /* try to remove the player from the torunament queue with http delete request acting the remove method */
        else {
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
            else {
              const data = await response.json();
              this.playersInTournament = data["response"];
            }
            // const data = await response.json();
            // console.log('Player deleted successfully:', data);
            this.participateStatus = !this.participateStatus;
            this.btnMsg = 'Participate';
          } catch (error) {
            console.error('Error deleting player:', error);
          }
        }
      },
    },
  }
</script>
