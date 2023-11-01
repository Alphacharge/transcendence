<template>
  <div>
    <p>Your machine's IP address is: {{ ipAddress }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ipAddress: null,
    };
  },
  created() {
    this.ipAddress = process.env.VUE_APP_BACKEND_IP;

    if (!this.ipAddress) {
      this.ipAddress = "VUE_APP_BACKEND_IP needed in .env file";
    }
  },
};
</script>
