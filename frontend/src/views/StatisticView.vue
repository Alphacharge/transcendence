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
          v-for="(data, index) in sortedStatistics"
          :key="index"
          :class="{ 'first-row': index === 0, 'other-rows': index > 0 }"
        >
          <td>{{ data.field1 }}</td>
          <td>{{ data.field2 }}</td>
          <td>{{ data.field3 }}</td>
          <td>{{ data.field4 }}</td>
          <td>{{ data.field5 }}</td>
          <td>{{ data.field6 }}</td>
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
      statistics: [
        {
          field1: "Daten 1",
          field2: "Daten 2",
          field3: "Daten 3",
          field4: "Daten 4",
          field5: "Daten 5",
          field6: "Daten 6",
          field7: "Daten 7",
          field8: "Daten 8",
          field9: "Daten 9",
          field10: "Daten 10",
          field11: "Daten 11",
          field12: "Daten 12",
        },
        // Füge hier weitere Statistikdaten hinzu
      ],
      sortKey: "field3",
      sortDirection: "desc",
    };
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
