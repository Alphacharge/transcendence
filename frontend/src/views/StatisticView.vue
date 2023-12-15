<template>
  <div class="centered">
    <div class="container-ms">
      <div>
        <h2>Milestones</h2>
        <div class="ms-row">
          <div class="box">
            <div class="headline">{{ $t("LongestGame") }}</div>
            <div class="content">
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.longestGame.l_avatar_id}${milestones.longestGame.l_avatar_mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="name-table-left">
                {{ milestones.longestGame.l_username }}
              </div>
              <div class="score-table-center">
                <b>:</b>
              </div>
              <div v-if="milestones" class="name-table-right">
                {{ milestones.longestGame.r_username }}
              </div>
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.longestGame.r_avatar_id}${milestones.longestGame.r_avatar_mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="value">
                {{ milestones.longestGame.duration }}
              </div>
            </div>
          </div>
          <div class="box">
            <div class="headline">{{ $t("LongestBreak") }}</div>
            <div class="content">
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.longestBreak.l_user.avatar.id}${milestones.longestBreak.l_user.avatar.mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="name-table-left">
                {{ milestones.longestBreak.l_user.username }}
              </div>
              <div class="score-table-center">
                <b>:</b>
              </div>
              <div v-if="milestones" class="name-table-right">
                {{ milestones.longestBreak.r_user.username }}
              </div>
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.longestBreak.r_user.avatar.id}${milestones.longestBreak.r_user.avatar.mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="value">
                {{ milestones.longestBreak.longest_break }} Contacts
              </div>
            </div>
          </div>
        </div>
        <div class="ms-row">
          <div class="box">
            <div class="headline">{{ $t("MostContacts") }}</div>
            <div class="content">
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.mostContacts.avatar_id}${milestones.mostContacts.avatar_mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="name-table-left">
                {{ milestones.mostContacts.username }}
              </div>
              <div v-if="milestones" class="value">
                {{ milestones.mostContacts.total_contacts }}
              </div>
            </div>
          </div>
          <div class="box">
            <div class="headline">{{ $t("ShortestGame") }}</div>
            <div class="content">
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.shortestGame.l_avatar_id}${milestones.shortestGame.l_avatar_mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="name-table-left">
                {{ milestones.shortestGame.l_username }}
              </div>
              <div class="score-table-center">
                <b>:</b>
              </div>
              <div v-if="milestones" class="name-table-right">
                {{ milestones.shortestGame.r_username }}
              </div>
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.shortestGame.r_avatar_id}${milestones.shortestGame.r_avatar_mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="value">
                {{ milestones.shortestGame.duration }}
              </div>
            </div>
          </div>
        </div>
        <div class="ms-row">
          <div class="box">
            <div class="headline">{{ $t("HighestWin") }}</div>
            <div class="content">
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.highestWin.avatar_id}${milestones.highestWin.avatar_mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="name-table-left">
                {{ milestones.highestWin.username }}
              </div>
              <div v-if="milestones" class="value">
                +{{ milestones.highestWin.max_win_diff }}
              </div>
            </div>
          </div>
          <div class="box">
            <div class="headline">{{ $t("LeastContacts") }}</div>
            <div class="content">
              <div class="image-table">
                <div class="image_history">
                  <img
                    v-if="milestones"
                    :src="`avatars/${milestones.leastContacts.avatar_id}${milestones.leastContacts.avatar_mime_type}`"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div v-if="milestones" class="name-table-left">
                {{ milestones.leastContacts.username }}
              </div>
              <div v-if="milestones" class="value">
                {{ milestones.leastContacts.total_contacts }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3>{{ $t("Statistics") }}</h3>
      <table class="table table-bordered transparent-table">
        <thead>
          <tr>
            <th @click="sortTable('username')">{{ $t("User") }}</th>
            <th @click="sortTable('matches')">{{ $t("Matches") }}</th>
            <th @click="sortTable('wins')">{{ $t("Wins") }}</th>
            <th @click="sortTable('losses')">{{ $t("Losses") }}</th>
            <th @click="sortTable('kd')">K/D</th>
            <th @click="sortTable('tourmatches')">
              {{ $t("TournamentMatches") }}
            </th>
            <th @click="sortTable('tourwins')">{{ $t("TournamentWins") }}</th>
            <th @click="sortTable('contacts[0].total_contacts')">
              {{ $t("ballContacts") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Iteriere über die Statistikdaten und zeige sie in der Tabelle an -->
          <tr v-for="row in sortedStatistics" :key="row.userId">
            <td>{{ row.username }}</td>
            <td>{{ row.matches }}</td>
            <td>{{ row.wins }}</td>
            <td>{{ row.losses }}</td>
            <td>{{ (row.wins / row.losses).toFixed(2) }}</td>
            <td>{{ row.tourmatches }}</td>
            <td>{{ row.tourwins }}</td>
            <td>{{ row.contacts[0].total_contacts }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3>{{ $t("Graphs") }}</h3>
    <p style="text-align: center; color: rgb(219, 219, 227)">
      {{ $t("graphDescription") }}
    </p>
    <div class="graph-wrapper">
      <div class="graph-row">
        <div class="graph-container">
          <canvas id="championsBoard" class="chart-canvas"></canvas>
        </div>
      </div>
      <p style="text-align: center; color: rgb(219, 219, 227)">
        {{ $t("ballContacts") }}
      </p>
      <div class="graph-row">
        <div class="graph-container">
          <canvas id="gameType" class="chart-canvas"></canvas>
        </div>
      </div>
      <div class="graph-row">
        <div class="graph-container">
          <canvas id="kdChart" class="chart-canvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      milestones: null,
      statistics: null,
      sortKey: "wins",
      sortDirection: "desc",
      userStatistics: [],
    };
  },
  mounted() {
    // Make a call to your NestJS backend when the component is mounted
    this.fetchMilestones();
    this.fetchStats();
  },
  computed: {
    sortedStatistics() {
      if (!this.statistics) return [];

      const modifier = this.sortDirection === "desc" ? -1 : 1;

      return this.statistics.slice().sort((a, b) => {
        if (this.sortKey === "username") {
          const aValue = a[this.sortKey].toLowerCase();
          const bValue = b[this.sortKey].toLowerCase();
          return modifier * aValue.localeCompare(bValue);
        }

        // Handle "kd" separately
        if (this.sortKey === "kd") {
          const aValue = a.wins / a.losses;
          const bValue = b.wins / b.losses;
          return modifier * (aValue - bValue);
        }

        // Handle "ballContacts" separately
        if (this.sortKey === "ballContacts") {
          const aValue = a.contacts.reduce(
            (total, contact) => total + contact.total_contacts,
            0,
          );
          const bValue = b.contacts.reduce(
            (total, contact) => total + contact.total_contacts,
            0,
          );
          return modifier * (aValue - bValue);
        }

        // Handle other keys
        const aValue = this.getValue(a, this.sortKey);
        const bValue = this.getValue(b, this.sortKey);
        return modifier * (aValue - bValue);
      });
    },
  },
  methods: {
    sortTable(key) {
      if (key === this.sortKey) {
        this.sortDirection = this.sortDirection === "desc" ? "asc" : "desc";
      } else {
        this.sortKey = key;
        this.sortDirection = key === "username" ? "asc" : "desc";
      }
    },
    getValue(obj, key) {
      // Handle nested properties
      const keys = key.split(".");
      return keys.reduce(
        (acc, k) => (acc && acc[k] !== undefined ? acc[k] : null),
        obj,
      );
    },
    convertContacts(data) {
      return data.map((user) => {
        // Handle "ballContacts" separately
        if (user.contacts && user.contacts.length > 0) {
          user.ballContacts = user.contacts.reduce(
            (total, contact) => total + contact.total_contacts,
            0,
          );
        } else {
          user.ballContacts = 0;
        }

        return user;
      });
    },

    async fetchMilestones() {
      try {
        // Replace 'YOUR_BACKEND_URL' with the actual URL of your NestJS backend
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/milestones`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          this.milestones = data;
          // Handle the user history data as needed
        } else {
          console.error("Failed to fetch milestones");
        }
      } catch (error) {
        console.error("Error fetching milestones:", error);
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
          this.statistics = this.convertContacts(data);
          this.renderChart();
        } else {
          console.error("Failed to fetch statistics");
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    },
    renderChart() {
      this.userStatistics = this.statistics;
      this.userStatistics.sort((a, b) => b.wins - a.wins);
      const usernames = this.userStatistics.map((user) => user.username);
      const wins = this.userStatistics.map((user) => user.wins);
      const losses = this.userStatistics.map((user) => user.losses);
      const kd = this.userStatistics.map((user) => user.wins / user.losses);
      kd.forEach((value, index, array) => {
        array[index] = value < 1 ? value * -1 : value + 1;
      });
      const histogram = document
        .getElementById("championsBoard")
        .getContext("2d");
      //doughnut
      const usernameDT = this.userStatistics.map((user) => user.username);
      const contactsDT = this.userStatistics.map(
        (user) => user.contacts[0].total_contacts,
      );
      //kd
      const kdChart = document.getElementById("kdChart").getContext("2d");

      const doughnutData = {
        labels: usernameDT,
        datasets: [
          {
            data: contactsDT,
            backgroundColor: [
              "rgb(5, 155, 255)",
              "rgb(6, 8, 139)",
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 206, 86)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(220, 20, 60)",
              "rgb(0, 128, 128)",
              "rgb(0, 0, 139)",
              "rgb(139, 0, 139)",
              "rgb(255, 140, 0)",
              "rgb(218, 165, 32)",
              "rgb(107, 142, 35)",
              "rgb(70, 130, 180)",
              "rgb(255, 165, 0)",
              "rgb(128, 0, 0)",
              "rgb(0, 0, 128)",
              "rgb(0, 128, 0)",
              "rgb(128, 128, 0)",
              "rgb(173, 216, 230)",
              "rgb(255, 192, 203)",
              "rgb(255, 255, 0)",
              "rgb(255, 0, 255)",
              "rgb(0, 255, 255)",
              "rgb(255, 255, 255)",
              "rgb(0, 0, 0)",
              "rgb(128, 128, 128)",
              "rgb(192, 192, 192)",
            ],
            hoverOffset: 1,
            borderWidth: 0,
          },
        ],
      };
      const doughnut = document.getElementById("gameType").getContext("2d");
      Chart.defaults.color = "#dbdbe3";
      new Chart(histogram, {
        type: "bar",
        data: {
          labels: usernames,
          datasets: [
            {
              label: this.$t("Wins"),
              data: wins,
              backgroundColor: "rgba(0,115,0,0.5)",
            },
            {
              label: this.$t("Losses"),
              data: losses,
              backgroundColor: "rgba(230,0,0,0.5)",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
              },
            },
            y: {
              display: true,
              stacked: true,
              title: {
                display: true,
              },
            },
          },
        },
      });
      new Chart(doughnut, {
        type: "doughnut",
        data: doughnutData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          title: {
            display: true,
            text: this.$t("ballContacts"),
            font: {
              size: 16, // Adjust the font size as needed
              weight: "bold", // Adjust the font weight as needed
            },
          },
        },
      });
      // New K/D bar chart
      new Chart(kdChart, {
        type: "bar",
        data: {
          labels: usernames,
          datasets: [
            {
              label: "K/D",
              data: kd,
              backgroundColor: "rgba(75,192,192,0.7)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
              },
            },
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.ms-row {
  display: flex;
}

h2 {
  text-align: center;
}

h3 {
  margin-top: 2em;
  text-align: center;
}
.box {
  flex: 1;
  height: 6em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5em;
  display: flex;
  padding: 0.5em;
  margin: 0.5em;
  flex-direction: column;
}
.content {
  display: flex;
}
.headline {
  width: 100%;
  margin-bottom: 0.5em;
}
.name-table-left {
  flex: 2;
  text-align: left;
  padding: 0 1em;
  display: flex;
  align-items: center;
}

.name-table-right {
  flex: 2;
  text-align: right;
  padding: 0 1em;
  display: flex;
  align-items: center;
}
.score-table-center {
  margin: 0 0.5em;
  display: flex;
  align-items: center;
}
.value {
  flex: 2;
  text-align: right;
  display: flex;
  align-items: center;
}

.image-table {
  width: 48px;
}
.image_history {
  width: 48px;
  height: 48px;
  overflow: hidden;
  display: inline-block;
  position: relative;
}
.image_history img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
}
.container-ms {
  width: 100%;
  height: 80%;
}

.centered {
  align-items: center;
  margin: 0 15%;
  color: rgb(217, 217, 229);
  margin-top: 4em;
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

.graph-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.graph-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
}
.graph-container {
  width: 100%;
  text-align: center;
}
.chart-canvas {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 1em;
}
</style>
