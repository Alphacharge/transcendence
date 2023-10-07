<template>
  <h1>Connection State Component</h1>
  <p>State: {{ connected }}</p>
</template>

<script>
import { state } from "@/socket";

export default {
  name: "ConnectionState",

  computed: {
    connected() {
      return state.connected;
    },
  },
};
</script>
