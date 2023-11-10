<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/pong">Pong</router-link> |
    <router-link to="/tournament">Tournament</router-link> |
    <router-link to="/login-fields">Login Fields</router-link> |
    <router-link to="/ip">IP-Panel</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/signup">Signup</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <BackgroundComponent />
  <router-view />
</template>
<script>
  import BackgroundComponent from '@/components/BackgroundComponent.vue';
  export default {
    components: {BackgroundComponent},
  }
</script>
<style>
body {
  background-color: rgb(12, 8, 48);
  display:inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
  overflow:auto;
}
</style>