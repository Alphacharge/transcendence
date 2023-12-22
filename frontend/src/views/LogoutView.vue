<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.sendLogOutRequest();
  },

  methods: {
    async sendLogOutRequest() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/auth/logout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );
        if (response.ok) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("userId");
          this.$router.push({ name: "login" });
        }
      } catch (error) {
        this.success = false;
        this.message = "60";
      }
    },
  },
};
</script>
