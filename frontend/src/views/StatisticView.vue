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
            <th>{{ $t("User") }}</th>
            <th @click="sortTable('matches')">{{ $t("Matches") }}</th>
            <th @click="sortTable('wins')">{{ $t("Wins") }}</th>
            <th @click="sortTable('losses')">{{ $t("Losses") }}</th>
            <th @click="sortTable('kd')">K/D</th>
            <th @click="sortTable('tourmatches')">
              {{ $t("TournamentMatches") }}
            </th>
            <th @click="sortTable('tourwins')">{{ $t("TournamentWins") }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Iteriere über die Statistikdaten und zeige sie in der Tabelle an -->
          <tr v-for="row in sortedStatistics" :key="row.userId">
            <td>{{ row.username }}</td>
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
    <h3>Graphs</h3>
    <div class="graph-wrapper">
      <canvas id="userStatsChart"></canvas>
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
          console.log(this.milestones);
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
          this.statistics = data;
          this.renderChart();
          // Handle the user history data as needed
        } else {
          console.error("Failed to fetch statistics");
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    },
    renderChart() {
      // try {
      //   // Replace 'YOUR_BACKEND_URL' with the actual URL of your NestJS backend
      //   const response = await fetch(
      //     `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/allstats`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     },
      //   );
      //   if (response.ok) {
      //     const data = await response.json();
      this.userStatistics = this.statistics; //data;
      this.userStatistics.sort((a, b) => b.matches - a.matches);
      const usernames = this.userStatistics.map((user) => user.username);
      const wins = this.userStatistics.map((user) => user.wins);
      const losses = this.userStatistics.map((user) => user.losses);
      const ctx = document.getElementById("userStatsChart").getContext("2d");
      Chart.defaults.backgroundColor = "#9BD0F5";
      Chart.defaults.borderColor = "#36A2EB";
      Chart.defaults.color = "#dbe375";
      Chart.defaults.font.size = "18";
      Chart.defaults.font.weight = "bold";
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: usernames,
          datasets: [
            {
              label: "Wins",
              data: wins,
            },
            {
              label: "Losses",
              data: losses,
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
                text: "Users",
              },
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: "Games",
              },
            },
          },
        },
      });
      // Handle the user history data as needed
      //   } else {
      //     console.error("Failed to render statistics");
      //   }
      // } catch (error) {
      //   console.error("Error rendering user history:", error);
      // }
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
  /* align-items: center; */
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

.graph-wrapper {
  height: 40vh;
  width: 60vw;
}
</style>
