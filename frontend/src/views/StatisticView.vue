<template>
  <div>
    <h2 class="centered">Records</h2>
    <div class="container">
      <div class="patch-wrapper">
        <div class="patch-left">
          <div class="sub-patch">{{ $t("LongestGame") }}<br>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.longestGame.l_avatar_id}${milestones.longestGame.l_avatar_mime_type}`" alt="Avatar" />
              </div>
            <div v-if="milestones">
              {{ milestones.longestGame.l_username }}
            </div>
            <div>
              <b>:</b>
            </div>
            <div v-if="milestones">
              {{ milestones.longestGame.r_username }}
            </div>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.longestGame.r_avatar_id}${milestones.longestGame.r_avatar_mime_type}`" alt="Avatar" />
              </div>
              <div v-if="milestones">
                {{ milestones.longestGame.duration }}
              </div>
          </div>
          <div class="sub-patch">{{ $t("LongestBreak") }}<br>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.longestBreak.l_user.avatar.id}${milestones.longestBreak.l_user.avatar.mime_type}`" alt="Avatar" />
              </div>
            <div v-if="milestones">
              {{ milestones.longestBreak.l_user.username }}
            </div>
            <div>
              <b>:</b>
            </div>
            <div v-if="milestones">
              {{ milestones.longestBreak.r_user.username }}
            </div>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.longestBreak.r_user.avatar.id}${milestones.longestBreak.r_user.avatar.mime_type}`" alt="Avatar" />
              </div>
              <div v-if="milestones">
                {{ milestones.longestBreak.longest_break }} Contacts
              </div>
          </div>
          <div class="sub-patch">{{ $t("MostContacts") }}<br>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.mostContacts.avatar_id}${milestones.mostContacts.avatar_mime_type}`" alt="Avatar" />
              </div>
            <div v-if="milestones">
              {{ milestones.mostContacts.username }}
            </div>
              <div v-if="milestones">
                {{ milestones.mostContacts.total_contacts }}
              </div>
          </div>
        </div>
        <div class="patch-right">
          <div class="sub-patch">{{ $t("ShortestGame") }}<br>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.shortestGame.l_avatar_id}${milestones.shortestGame.l_avatar_mime_type}`" alt="Avatar" />
              </div>
            <div v-if="milestones">
              {{ milestones.shortestGame.l_username }}
            </div>
            <div>
              <b>:</b>
            </div>
            <div v-if="milestones">
              {{ milestones.shortestGame.r_username }}
            </div>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.shortestGame.r_avatar_id}${milestones.shortestGame.r_avatar_mime_type}`" alt="Avatar" />
              </div>
              <div v-if="milestones">
                {{ milestones.shortestGame.duration }}
              </div>
            </div>
          <div class="sub-patch">{{ $t("HighestWin") }}<br>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.highestWin.avatar_id}${milestones.highestWin.avatar_mime_type}`" alt="Avatar" />
              </div>
            <div v-if="milestones">
              {{ milestones.highestWin.username }}
            </div>
              <div v-if="milestones">
                +{{ milestones.highestWin.max_win_diff }}
              </div>
          </div>
          <div class="sub-patch">{{ $t("LeastContacts") }}<br>
            <div class="image_history">
                <img v-if="milestones" :src="`avatars/${milestones.leastContacts.avatar_id}${milestones.leastContacts.avatar_mime_type}`" alt="Avatar" />
              </div>
            <div v-if="milestones">
              {{ milestones.leastContacts.username }}
            </div>
              <div v-if="milestones">
                {{ milestones.leastContacts.total_contacts }}
              </div>
          </div>
        </div>
      </div>
      <h2 class="centered">Statistics</h2>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Statistikdaten können hier aus deinem Backend abgerufen werden
      milestones: null,
      statistics: null,
      sortKey: "wins",
      sortDirection: "desc",
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
          // Handle the user history data as needed
        } else {
          console.error("Failed to fetch statistics");
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    },
    // getAvatarSrc(avatar) {
    //   // Adjust the path as needed based on your avatar structure
    //   return `avatar/${avatar.id}.${avatar.mime_type}`;
    // },
  },
};
</script>

<style scoped>
.patch-wrapper {
  display: flex;
  justify-content: space-between;
  background: transparent;
  flex-wrap: wrap;
}
.patch-left{
  flex-grow: 1;
}
.patch-right {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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

.centered {
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
