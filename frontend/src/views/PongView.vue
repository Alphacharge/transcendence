<template>
  <div class="button-group-container">
    <PongButtons v-if="pongButtonsVisible" />
  </div>
  <div>
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
  <CountDown />
  <PongButtons />
  <ScoreBoard />
  <GameArea :player-number="playerNumber"></GameArea>
</template>

<script>
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import PongButtons from "@/components/PongButtons.vue";
import CountDown from "@/components/CountDown.vue";
import { connectWebSocket, socket } from "@/assets/utils/socket";

export default {
  components: { GameArea, ScoreBoard, PongButtons, CountDown },

  data() {
    return {
      playerNumber: null,
    };
  },

  mounted() {
    connectWebSocket();

    // received info if we are left or right
    socket.on("player1", () => {
      this.playerNumber = 1;
    });
    socket.on("player2", () => {
      this.playerNumber = 2;
    });
  },
};
</script>

<style>
.button-group-container {
  position: absolute;
  top: 15%; /* Ändere diese Werte entsprechend deiner gewünschten Position */
  left: 50%;
  transform: translateX(-50%); /* Zentriert die Button-Gruppe horizontal */
  width: 40%; /* 100% der Breite des Viewports */
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
  right: 58em;
}
</style>