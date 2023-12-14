<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
    <Nav-Bar></Nav-Bar>
  </nav>
  <BackgroundComponent />
  <router-view />
</template>

<script>
import BackgroundComponent from "@/components/BackgroundComponent.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  components: { BackgroundComponent, NavBar },
};
</script>

<style>
.custom-body {
  /* Add your body styles here */
  background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
}
#app {
  height: 100vw;
  overflow-x: hidden;
}
</style>
