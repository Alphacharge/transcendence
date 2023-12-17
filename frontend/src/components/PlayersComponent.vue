<template>
  <div class="scoreboard">
    <div class="score">
      <div class="box" :style="{ borderColor: getPlayerColor(0) }">
        <div class="content">
          <div class="image-table">
            <div class="image_history">
              <img
                v-if="players[0]"
                :src="`avatars/${players[0].avatar.id}${players[0].avatar.mime_type}`"
                alt="Avatar"
              />
            </div>
          </div>
          <div v-if="players[0]" class="name-table-left">
            {{ players[0].username }}
          </div>
        </div>
      </div>
      <div class="box" :style="{ borderColor: getPlayerColor(1) }">
        <div class="content">
          <div class="image-table">
            <div class="image_history">
              <img
                v-if="players[1]"
                :src="`avatars/${players[1].avatar.id}${players[1].avatar.mime_type}`"
                alt="Avatar"
              />
            </div>
          </div>
          <div v-if="players[1]" class="name-table-left">
            {{ players[1].username }}
          </div>
        </div>
      </div>
      <div class="box" :style="{ borderColor: getPlayerColor(2) }">
        <div class="content">
          <div class="image-table">
            <div class="image_history">
              <img
                v-if="players[2]"
                :src="`avatars/${players[2].avatar.id}${players[2].avatar.mime_type}`"
                alt="Avatar"
              />
            </div>
          </div>
          <div v-if="players[2]" class="name-table-left">
            {{ players[2].username }}
          </div>
        </div>
      </div>
      <div class="box" :style="{ borderColor: getPlayerColor(3) }">
        <div class="content">
          <div class="image-table">
            <div class="image_history">
              <img
                v-if="players[3]"
                :src="`avatars/${players[3].avatar.id}${players[3].avatar.mime_type}`"
                alt="Avatar"
              />
            </div>
          </div>
          <div v-if="players[3]" class="name-table-left">
            {{ players[3].username }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { socket } from "@/assets/utils/socket";

export default {
  props: {
    inActiveTournament: Boolean,
  },

  data() {
    return {
      players: [],
    };
  },

  mounted() {
    socket.on("lossOf", (username) => {
      const playerIndex = this.players.findIndex(
        (player) => player.username == username,
      );

      if (playerIndex != -1) {
        this.players[playerIndex].borderColor = "rgba(255, 0, 0, 0.8)";
      }
    });

    socket.on("tournamentWinner", (username) => {
      const playerIndex = this.players.findIndex(
        (player) => player.username == username,
      );
      if (playerIndex != -1) {
        this.players[playerIndex].borderColor = "greenyellow";
      }
    });

    socket.on("tournamentReset", () => {
      // if i am not part of the running tournament, reset everything
      // if (!this.iAmRegistered) {
      if (!this.inActiveTournament) {
        this.players.length = 0;
      }
    });

    socket.on("playerJoinedTournament", (user) => {
      if (this.inActiveTournament) {
        return;
      }

      if (!this.players.some((player) => player.id == user.id)) {
        this.players.push(user);
      }
    });

    socket.on("playerLeftTournament", (userId) => {
      if (this.inActiveTournament) {
        return;
      }

      const index = this.players.findIndex((player) => player.id == userId);
      if (index !== -1) {
        this.players.splice(index, 1);
      }
    });
  },

  methods: {
    getPlayerColor(index) {
      if (this.players[index] && this.players[index].borderColor)
        return this.players[index].borderColor;

      return "rgba(255, 255, 255, 0.2)";
    },
  },
};
</script>

<style scoped>
.game-score {
  margin-left: 0.1em;
  text-align: center;
  font-size: 7em;
  color: rgb(217, 217, 229);
  flex: 1;
}

.announce-winner {
  color: rgb(217, 217, 229);
  text-align: center;
  font-size: 7em;
}

.score {
  display: flex;
  /* position: relative; */
}
.box {
  flex: 1;
  height: 10em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5em;
  display: flex;
  padding: 0.5em;
  align-items: center;
  margin: 0.5em;
  /* flex-direction: column; */
}

.content {
  display: flex;
}

.name-table-left {
  flex: 1;
  text-align: left;
  padding: 0 1em;
  display: flex;
  align-items: center;
  font-size: large;
  color: rgb(217, 217, 229);
}

.name-table-right {
  flex: 1;
  width: 100%;
  text-align: right;
  padding: 0 1em;
  display: flex;
  align-items: center;
  font-size: large;
  color: rgb(217, 217, 229);
}
.image_history {
  width: 92px;
  height: 92px;
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
</style>
