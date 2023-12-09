<template>
  <div
    class="clock"
    v-if="currentCount>0">
      {{ currentCount }}
  </div>
  <div
    v-if="currentCount==0"
    countDownVisible="false">
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
<style>
.clock {
  position: absolute;
  top: 50%; /* Adjust as needed */
  left: 50%; /* Adjust as needed */
  transform: translate(-50%, -50%);
  margin: 0;
  text-align: center;
  font-size: 20em;
  color: rgb(217,217,229);
  z-index: 2;
}
</style>
