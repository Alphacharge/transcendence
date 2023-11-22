<template>
  <div class="btn-group">
    <button @click="enterQueue()" class="btn btn-danger">
      {{ $t("EnterQueue") }}
    </button>
    <button @click="leaveQueue()" class="btn btn-warning">
      {{ $t("LeaveQueue") }}
    </button>
    <button @click="stopGame()" class="btn btn-success">
      {{ $t("AbortGame") }}
    </button>
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
      socket.stopGame();
    },
  },
};
</script>
