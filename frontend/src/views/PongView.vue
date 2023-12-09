<template>
  <PongButtons />
  <ScoreBoard />
  <div class="game-wrapper">
    <GameArea></GameArea>
    <CountDown
    v-if="countDownVisible" />
  </div>
</template>

<script>
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import PongButtons from "@/components/PongButtons.vue";
import CountDown from "@/components/CountDown.vue";
import { socket } from "@/assets/utils/socket";

export default {
  components: { GameArea, ScoreBoard, PongButtons, CountDown },
  data() {
    return {
      countDownVisible: false,
    }
  },
  mounted() {
    socket.on("startGame",()=>{
      this.countDownVisible=true;
    });
  },
};
</script>

<style>
.game-wrapper {
  position: relative;
}
</style>
