<template>
  <ConnectionState></ConnectionState>
  <ConnectionManager></ConnectionManager>
  <pongTestAnimation></pongTestAnimation>
</template>

<script>
import pongTestAnimation from "./components/pongTestAnimation.vue";
import ConnectionState from "./components/ConnectionState.vue";
import ConnectionManager from "./components/ConnectionManager.vue";

export default {
  name: "App",
  components: {
    pongTestAnimation,
    ConnectionState,
    ConnectionManager,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
