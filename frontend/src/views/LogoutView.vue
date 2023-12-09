<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.logout();
  },
  methods: {
    logout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("userId");
      this.$router.push({ name: "login" });
    },
  },
};
</script>
