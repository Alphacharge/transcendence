<template>
  <div>
    <h1 v-if="currentCount > 0">{{ currentCount }} ...</h1>
    <h1 v-else="currentCount === 0">{{ currentCount }} !</h1>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentCount: 3,
        intervalId: null,
      };
    },
    mounted() {
      this.countDown();
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
    },
    methods: {
      countDown() {
        this.intervalId = setInterval(
          ()=>{
            if (this.currentCount > 0) {
              this.currentCount--;
            }
          }, 1000);}
      }
    }
</script>
