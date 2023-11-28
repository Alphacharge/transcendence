<template>
  <div v-if="countdownVisible">
    <h1 v-if="currentCount > 0">{{ currentCount }} ...</h1>
    <h1 v-else>{{ currentCount }} !</h1>
  </div>
</template>
<script>
import { socket } from "@/assets/utils/socket";
export default {
  data() {
    return {
      currentCount: 3,
      countdownVisible: false,
    };
  },
  mounted() {
    this.countdownVisible = true;
    socket.on("countDown", (payload) => {
      this.currentCount = payload;
    });
  },

  beforeUnmount() {
    this.countdownVisible = false;
  },
};
</script>
