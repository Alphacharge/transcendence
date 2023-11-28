<template>
  <div>
    <h2 class="centered">Records</h2>
    <div class="container">
      <div class="patch-wrapper">
        <div class="patch-left">
          <div class="sub-patch">patch1</div>
          <div class="sub-patch">patch3</div>
          <div class="sub-patch">patch5</div>
        </div>
        <div class="patch-right">
          <div class="sub-patch">patch2</div>
          <div class="sub-patch">patch4</div>
          <div class="sub-patch">patch6</div>
        </div>
      </div>
      <h2 class="centered">Statistics</h2>
      <table class="table table-bordered transparent-table">
         <thead>
           <tr>
             <th>{{ $t("User") }}</th>
             <th @click="sortTable('matches')"> {{ $t("Matches") }}</th>
             <th @click="sortTable('wins')"> {{ $t("Wins") }}</th>
             <th @click="sortTable('losses')"> {{ $t("Losses") }}</th>
             <th @click="sortTable('kd')"> K/D</th>
             <th @click="sortTable('tourmatches')"> {{ $t("TournamentMatches") }}</th>
             <th @click="sortTable('tourwins')"> {{ $t("TournamentWins") }}</th>
           </tr>
         </thead>
         <tbody>
           <!-- Iteriere über die Statistikdaten und zeige sie in der Tabelle an -->
           <tr v-for="row in sortedStatistics" :key="row.userId">
             <td>{{ row.nick }}</td>
             <td>{{ row.matches }}</td>
             <td>{{ row.wins }}</td>
             <td>{{ row.losses }}</td>
             <td>{{ row.wins - row.losses }}</td>
             <td>{{ row.tourmatches }}</td>
             <td>{{ row.tourwins }}</td>
           </tr>
         </tbody>
        </table>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      // Statistikdaten können hier aus deinem Backend abgerufen werden
      statistics: null,
      sortKey: "wins",
      sortDirection: "desc",
    };
  },
  mounted() {
    // Make a call to your NestJS backend when the component is mounted
    this.fetchStats();
  },
  computed: {
    sortedStatistics() {
      if (!this.statistics) return [];
      return this.statistics.slice().sort((a, b) => {
        const modifier = this.sortDirection === "desc" ? -1 : 1;
        return modifier * (a[this.sortKey] - b[this.sortKey]);
      });
    },
  },
  methods: {
    sortTable(key) {
      if (key === this.sortKey) {
        this.sortDirection = this.sortDirection === "desc" ? "asc" : "desc";
      } else {
        this.sortKey = key;
        this.sortDirection = "desc";
      }
    },
    async fetchStats() {
      try {
        // Replace 'YOUR_BACKEND_URL' with the actual URL of your NestJS backend
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/allstats`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          this.statistics = data;
          // Handle the user history data as needed
        } else {
          console.error("Failed to fetch statistics");
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    },
    getAvatarSrc(avatar) {
      // Adjust the path as needed based on your avatar structure
      return `avatar/${avatar}.png`;
    },
  },
};
</script>

<style scoped>

.patch-wrapper{
  display: flex;
  justify-content: space-between;
  background: transparent;
  flex-wrap: wrap;
}
.patch-left,
.patch-right {
  display: flex;
  flex-direction: column;
}

.sub-patch {
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.container {
  width: 100%;
  height: 80%;
}

.centered{
  text-align: center;
}
.transparent-table {
  background: transparent;
  border-collapse: collapse;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
}

.transparent-table td,
.transparent-table th {
  background-color: rgba(17, 9, 69, 0.237);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #95b4f7;
}

.transparent-table th {
  color: #ffe600c8;
}


/* Add this style to capitalize text in the first row of table headers */
.transparent-table thead tr:first-child th {
  text-transform: uppercase;
}

@media screen and (max-width: 800px) {
  .transparent-table td,
  .transparent-table th {
    width: 100% / 6; 
  }
}

@media screen and (min-width: 800px) {
  .transparent-table td,
  .transparent-table th {
    width: 100% / 6;
  }
}
</style>
