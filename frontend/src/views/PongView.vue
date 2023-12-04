<template>
  <PongButtons />
  <CountDown />
  <ScoreBoard />
  <GameArea></GameArea>
</template>

<script>
import GameArea from "@/components/GameArea.vue";
import ScoreBoard from "@/components/ScoreBoard.vue";
import PongButtons from "@/components/PongButtons.vue";
import CountDown from "@/components/CountDown.vue";

export default {
  components: { GameArea, ScoreBoard, PongButtons, CountDown },
};
</script>
