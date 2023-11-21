import ScoreBoard from './ScoreBoard.vue';
<template>
  <div class="button-group-container">
    <PongButtons v-if="pongButtonsVisible" />
  </div>
  <div>
    <p>Game ID: {{ gameId }}</p>
    <p>I am player number: {{ playerNumber }}</p>
    <div class="score-board">
        <div class="left-score">
          <ScoreBoard :playerScore="player1Score" playerName="Player 1" />
      </div>
       <div class="right-score">
        <ScoreBoard :playerScore="player2Score" playerName="Player 2" />
        </div>
      </div>
  </div>
  <!-- <ScoreBoard :player1Score="player1Score" :player2Score="player2Score" /> -->
  <GameArea :gameId="gameId" :player-number="playerNumber"></GameArea>
</template>

<script>
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import PongButtons from "@/components/PongButtons.vue";
import { socket } from "@/assets/utils/socket";

export default {
  props: {
    pongButtonsVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      player1Score: 0,
      player2Score: 0,
      gameId: null,
      playerNumber: 0,
    };
  },
  components: { GameArea, ScoreBoard, PongButtons },
  mounted() {
    // received new game ID from server
    socket.on("gameId", (payload) => {
      this.gameId = payload.gameId;
      this.player1Score = 0;
      this.player2Score = 0;
    });
    // received info if we are left or right
    // better name?
    socket.on("player1", () => {
      this.playerNumber = 1;
    });
    socket.on("player2", () => {
      this.playerNumber = 2;
    });
    // received score update from server
    socket.on("scoreUpdate", (playerScores) => {
      this.player1Score = playerScores.player1;
      this.player2Score = playerScores.player2;
    });
  },
  methods: {
    enterQueue() {
      socket.enterQueue();
    },
    leaveQueue() {
      socket.leaveQueue();
    },
    stopGame() {
      socket.stopGame(this.gameId);
    },
  },
};
</script>

<style>
.button-group-container {
  position: absolute;
  top: 15%; /* Ändere diese Werte entsprechend deiner gewünschten Position */
  left: 50%;
  transform: translateX(-50%); /* Zentriert die Button-Gruppe horizontal */
  width: 100%; /* 100% der Breite des Viewports */
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Füge hier weitere Stile für den Hauptcontainer hinzu, wenn nötig */
}

.score-board {
  display:flex;
  justify-content: center !important;
  position: absolute;
  width: calc(100% + 50em);
  bottom: 12em;
}

.left-score{
  flex: 1;
  position: absolute;
   left: 8em;
} 
.right-score{
  flex: 1;
  position: absolute;
  right: 60em;
}
</style>