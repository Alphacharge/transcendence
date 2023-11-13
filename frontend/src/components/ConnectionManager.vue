<!-- ConnectionManager.vue -->

<template>
  <div>
    <button @click="connect()">Connect</button>
    <button @click="disconnect()">Disconnect</button>
  </div>
</template>

<script>
import { socket } from "@/assets/utils/socket";

export default {
  name: "ConnectionManager",

  methods: {
    connect() {
      socket.connect();
    },
    disconnect() {
      socket.disconnect();
    },
  },
};
</script>
