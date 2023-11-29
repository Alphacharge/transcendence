<template>
  <div class="btn-group">
    <button @click="enterQueue()" class="btn btn-danger">
      {{ $t("EnterQueue") }}
    </button>
    <button @click="leaveQueue()" class="btn btn-warning">
      {{ $t("LeaveQueue") }}
    </button>
  </div>
</template>
<script>
import { connectWebSocket, socket } from "@/assets/utils/socket";

export default {
  methods: {
    enterQueue() {
      connectWebSocket();
      socket.enterQueue();
    },
    leaveQueue() {
      socket.leaveQueue();
    },
  },
};
</script>
