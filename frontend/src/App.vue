<template>
  <div class="container-border">
    <ConnectionManager></ConnectionManager>
    <ConnectionState></ConnectionState>
    <IpPanel></IpPanel>
  </div>
  <div class="container-border">
    <LoginFields></LoginFields>
  </div>
  <div class="container-border">
    <PongGame></PongGame>
  </div>
</template>

<script>
import ConnectionManager from "./components/ConnectionManager.vue";
import ConnectionState from "./components/ConnectionState.vue";
import IpPanel from "./components/IpPanel.vue";
import LoginFields from "./components/LoginFields.vue";
import PongGame from "./components/PongGame.vue";

export default {
  name: "App",
  components: {
    PongGame,
    ConnectionManager,
    ConnectionState,
    IpPanel,
    LoginFields,
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
.container-border {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
