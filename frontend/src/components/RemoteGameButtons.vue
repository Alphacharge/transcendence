<template>
  <div class="btn-group">
    <button v-if="!isInQueue" @click="enterQueue()" class="btn btn-danger">
      {{ $t("EnterQueue") }}
    </button>
    <button v-else @click="leaveQueue()" class="btn btn-warning">
      {{ $t("LeaveQueue") }}
    </button>
  </div>
</template>

<script>
import { connectWebSocket, socket } from "@/assets/utils/socket";

export default {
  data() {
    return {
      isInQueue: false, // is the user queued right now? user gets removed from queue on websocket connection loss, so don't worry about checking
    };
  },

  mounted() {
    connectWebSocket();

    // show buttons based on backend events
    socket.on("addedToQueue", () => {
      this.isInQueue = true;
    });
    socket.on("removedFromQueue", () => {
      this.isInQueue = false;
    });
  },

  methods: {
    enterQueue() {
      socket.enterQueue();
    },
    leaveQueue() {
      socket.leaveQueue();
    },
  },
};
</script>
