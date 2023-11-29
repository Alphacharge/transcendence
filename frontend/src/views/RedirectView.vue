<template>
  <div class="redirect">
    <h1>Redirect gif would be great here</h1>
    <p>{{ access_token }}, {{ userId }}</p>
  </div>
  </template>

<script>
  import router from "@/router";
  export default {
    data() {
      return {
        access_token: '',
        userId: '',
      }
    },
    mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      const access_token = urlParams.get('access_token');
      const userId = urlParams.get('userId');
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("userId", userId);
      router.push("/");
    },
  };
</script>
