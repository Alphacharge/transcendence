<template>
  <div class="scoreboard">
    <div class="announce-winner" v-if="announceVisible">
      {{ $t("Player") }} {{ winningPlayer }} {{ $t("wins") }}!
    </div>
    <div class="score">
      <div v-if="scoreEnabled" class="box box-left">
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
      <div class="game-score">{{ player1Score }}:{{ player2Score }}</div>
      <div v-if="scoreEnabled" class="box box-right">
        <div class="content">
          <div v-if="players[1]" class="name-table-right">
            {{ players[1].username }}
          </div>
          <div class="image-table">
            <div class="image_history">
              <img
                v-if="players[1]"
                :src="`avatars/${players[1].avatar.id}${players[1].avatar.mime_type}`"
                alt="Avatar"
              />
            </div>
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
    scoreEnabled: Boolean,
  },
  data() {
    return {
      announceVisible: false,
      player1Score: 0,
      player2Score: 0,
      winningPlayer: "",
      players: [],
    };
  },

  mounted() {
    socket.on("scoreUpdate", (playerScores) => {
      this.player1Score = playerScores.player1;
      this.player2Score = playerScores.player2;
    });

    socket.on("victory", (payload) => {
      this.announceVisible = true;
      this.winningPlayer = payload;
    });

    // reset values
    socket.on("addedToQueue", () => {
      this.announceVisible = false;
      this.player1Score = 0;
      this.player2Score = 0;
      this.winningPlayer = "";
    });
    socket.on("countDown", () => {
      this.announceVisible = false;
      this.player1Score = 0;
      this.player2Score = 0;
      this.winningPlayer = "";
    });

    // received info if we are left or right
    socket.on("player1", (players) => {
      console.log(players);
      this.players = players;
      this.player1Score = 0;
    });
    socket.on("player2", (players) => {
      this.players = players;
      this.player2Score = 0;
    });
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
  flex: 2;
  height: 10em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5em;
  display: flex;
  padding: 0.5em;
  align-items: center;
  margin: 0.5em;
  /* flex-direction: column; */
}
.box-left {
  margin-left: 20%;
}
.box-right {
  margin-right: 20%;
  text-align: right;
  justify-content: right;
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
