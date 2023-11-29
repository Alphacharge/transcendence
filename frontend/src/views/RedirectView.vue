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
      console.error(`REDIRECTVIEW, MOUNTED, debug checkin`);
      const urlParams = new URLSearchParams(window.location.search);
      const access_token = urlParams.get('access_token');
      const userId = urlParams.get('userId');
      const userEmail = urlParams.get('userEmail');
      console.log(`REDIRECTVIEW, ONMOUNTED, access_token=${access_token}, userId=${userId}, userName=${userEmail}`);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("userId", userId);
      router.push("/");
    },
  };
</script>
