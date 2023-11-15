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
		pollingInterval: 0,
	  };
	},
	async mounted() {
	  this.playersInTournament = await this.countPlayers();
	  this.participateStatus = await this.checkMyStatus();
	  if (this.participateStatus) this.btnMsg = "Leave Tournament";
	  else this.btnMsg = "Participate";
	  this.pollingInterval = setInterval(async () => {
		this.playersInTournament = await this.countPlayers();
	  }, 5000);
	},
	beforeUnmount() {
	  clearInterval(this.pollingInterval);
	},
	watch: {
	  displayedPlayerCount(newValue) {
		this.$emit("playerCountChanged", newValue);
	  },
	},
	methods: {
	  async checkIn() {
		this.participationStatus = await this.checkMyStatus();
		console.log("Status", this.participateStatus);
		console.log("Checkin");
		if (!this.participateStatus) {
		  await this.addPlayer();
		  this.btnMsg = "Leave Tournament";
		} else {
		  await this.removePlayer();
		  this.btnMsg = "Participate";
		}
		this.participateStatus = await this.checkMyStatus();
		this.playersInTournament = await this.countPlayers();
	  },
	  retrieveToken() {
		const storedPlayerToken = localStorage.getItem("access_token");
		if (!storedPlayerToken) {
		  console.error("Player token not found in local storage");
		  return -1;
		}
		return storedPlayerToken;
	  },
	  retrieveUserId() {
		const userId = localStorage.getItem("userId");
		if (!userId) {
		  console.error("Player ID not found in local storage");
		  return -1;
		}
		return userId;
	  },
	  async addPlayer() {
		console.log("Add player");
		const storedPlayerToken = this.retrieveToken();
		const storedUserId = this.retrieveUserId();
		if (this.participateStatus || storedPlayerToken  === -1 || !storedUserId) {
		  return;
		}
		try {
		  const response = await fetch(
			`https://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/add`,
			{
			  method: "POST",
  
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				playerToken: storedPlayerToken,
				userId: storedUserId,
			  }),
			},
		  );
		  if (!response.ok) {
			throw new Error(`HTTPS error! Status: ${response.status}`);
		  }
		  const data = await response.json();
		  console.log(data);
  
		  return data["response"];
		} catch (error) {
		  console.error("Error adding player:", error);
		}
	  },
	  async removePlayer() {
		console.log("Remove player");
		const storedPlayerToken = this.retrieveToken();
		if (!this.participateStatus || storedPlayerToken === -1) return;
		try {
		  const response = await fetch(
			`https://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/${storedPlayerToken}`,
			{
			  method: "DELETE",
			  headers: {
				"Content-Type": "application/json",
			  },
			},
		  );
		  if (!response.ok) {
			throw new Error(`HTTPS error! Status: ${response.status}`);
		  }
		  const data = await response.json();
		  return data["response"];
		} catch (error) {
		  console.error("Error deleting player:", error);
		}
	  },
	  async countPlayers() {
		try {
		  const response = await fetch(
			`https://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/count`,
			{
			  method: "GET",
			  headers: {
				"Content-Type": "application/json",
			  },
			},
		  );
		  if (!response.ok) {
			throw new Error(`HTTPS error! Status: ${response.status}`);
		  }
		  const data = await response.json();
		  return data["response"];
		} catch (error) {
		  console.error("Error getting players in tournament:", error);
		}
	  },
	  async checkMyStatus() {
		const storedPlayerToken = this.retrieveToken();
		if (storedPlayerToken === -1) return;
		try {
		  const response = await fetch(
			`https://${process.env.VUE_APP_BACKEND_IP}:3000/tournament/status`,
			{
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				playerToken: storedPlayerToken,
			  }),
			},
		  );
		  if (!response.ok) {
			throw new Error(`HTTPS error! Status: ${response.status}`);
		  }
		  const data = await response.json();
		  const res = data["response"];
		  return res;
		} catch (error) {
		  console.error("Error adding player:", error);
		}
	  },
	},
  };
  </script>
  