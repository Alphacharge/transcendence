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
      isInQueue: false,
    };
  },

  mounted() {
    connectWebSocket();

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

<style scoped>
.btn-group {
  position: relative;
  width: 100%;
}
.btn-danger {
  width: 90%;
  border: 0;
  background-color: #35b522;
}

.btn-warning {
  width: 90%;
  border: 0;
  background-color: rgb(195, 30, 30);
}

.btn:hover {
  background-color: rgb(217, 217, 229);
  opacity: 0.5;
}
</style>
