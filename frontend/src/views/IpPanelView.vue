<template>
  <div>
    <p>Backend IP address: {{ ipAddress }}</p>
    <p>Backend Connection: {{ backendAnswer }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ipAddress: "VUE_APP_BACKEND_IP not found",
      backendAnswer: "no answer received",
    };
  },
  async created() {
    this.ipAddress = process.env.VUE_APP_BACKEND_IP;

    try {
      const response = await fetch(
        `http://${this.ipAddress}:3000/api/auth/test`,
      );
      if (response.ok) {
        this.backendAnswer = await response.text();
      }
    } catch (error) {
      console.log(`Fetch API Error: ${error.message}`);
    }
  },
};
</script>
