<template>
  <!-- <div> -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
    <router-link to="/"
      ><img src="/favicon.ico" alt="favicon" class="navbar-brand-icon"
    /></router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav flex-grow-1">
        <li class="nav-item flex-grow-1">
          <router-link to="/pong" class="nav-link">Pong</router-link>
        </li>
        <li class="nav-item flex-grow-1">
          <router-link to="/tournament" class="nav-link"
            >Tournament</router-link
          >
        </li>
        <li class="nav-item flex-grow-1">
          <router-link to="/login-fields" class="nav-link"
            >Login Fields</router-link
          >
        </li>
        <li class="nav-item flex-grow-1">
          <router-link to="/ip" class="nav-link">IP-Panel</router-link>
        </li>
        <li class="nav-item flex-grow-1">
          <router-link to="/login" class="nav-link">Login</router-link>
        </li>
        <li class="nav-item flex-grow-1">
          <router-link to="/statistic" class="nav-link">Statistics</router-link>
        </li>
        <li class="nav-item flex-grow-1">
          <router-link to="/signup" class="nav-link">Signup</router-link>
        </li>
        <li class="nav-item flex-grow-1">
          <router-link to="/about" class="nav-link">About</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <BackgroundComponent />
  <router-view />
  <!-- </div> -->
</template>

<script>
import BackgroundComponent from "@/components/BackgroundComponent.vue";
export default {
  components: { BackgroundComponent },
};
</script>

<style>
.custom-body {
  /* Add your body styles here */
  background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
}
#app {
  height: 100vw;
}
</style>
