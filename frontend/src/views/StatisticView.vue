<template>
  <div class="container mt-4">
    <h2>Statistic Page</h2>
    <table class="table table-bordered transparent-table">
      <thead>
        <tr>
          <th>{{ $t("User") }}</th>
          <th @click="sortTable('field2')">{{ $t("Matches") }}</th>
          <th @click="sortTable('field3')">{{ $t("Wins") }}</th>
          <th @click="sortTable('field4')">{{ $t("Losses") }}</th>
          <th @click="sortTable('field5')">{{ $t("TournamentMatches") }}</th>
          <th @click="sortTable('field6')">{{ $t("TournamentWins") }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- Iteriere über die Statistikdaten und zeige sie in der Tabelle an -->
        <tr
          v-for="(row, index) in userStatistics"
          :key="index"
          :class="{ 'first-row': index === 0, 'other-rows': index > 0 }"
        >
          <td>{{ row.Nick }}</td>
          <td>{{ row.Matches }}</td>
          <td>{{ row.Wins }}</td>
          <td>{{ row.Losses }}</td>
          <td>{{ row.TournamentMatches }}</td>
          <td>{{ row.TournamentWins }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Statistikdaten können hier aus deinem Backend abgerufen werden
      statistics: null,
      sortKey: "field3",
      sortDirection: "desc",
    };
  },
  mounted() {
    // Make a call to your NestJS backend when the component is mounted
    this.fetchStats();
  },
  computed: {
    sortedStatistics() {
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
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/stats/all`,
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
.transparent-table {
  background: transparent;
  border-collapse: collapse;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.transparent-table td {
  background-color: rgba(17, 9, 69, 0.237);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #95b4f7;
}
.transparent-table th {
  background-color: rgba(17, 9, 69, 0.237);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffe600c8;
}

/* Add this style to capitalize text in the first row of table headers */
.transparent-table thead tr:first-child th {
  text-transform: uppercase;
}

@media screen and (max-width: 767px) {
  .transparent-table td,
  .transparent-table th {
    width: 100%; /* Bei Bildschirmen mit einer Breite von 767px oder kleiner: volle Breite für jede Zelle */
  }
}

@media screen and (min-width: 768px) {
  .transparent-table td,
  .transparent-table th {
    width: calc(
      100% / 6
    ); /* Bei Bildschirmen mit einer Breite von 768px oder größer: gleichmäßige Breite aufteilen */
  }
}
</style>
