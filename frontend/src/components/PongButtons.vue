<template>
  <div class="btn-group">
    <button @click="enterQueue()" class="btn btn-danger">Enter Queue</button>
    <button @click="leaveQueue()" class="btn btn-warning">Leave Queue</button>
    <button @click="stopGame()" class="btn btn-success">Abort Game</button>
  </div>
</template>
<script>
import { socket } from "@/assets/utils/socket";

export default {
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
