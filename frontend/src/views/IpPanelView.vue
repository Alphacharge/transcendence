<template>
  <div>
    <p>Backend IP address: {{ ipAddress }}</p>
    <p>Backend Connection: {{ backendAnswer }}</p>
    <ConnectionState></ConnectionState>
    <ConnectionManager></ConnectionManager>
  </div>
</template>

<script>
import ConnectionManager from "@/components/ConnectionManager.vue";
import ConnectionState from "@/components/ConnectionState.vue";

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
      const response = await fetch(`http://${this.ipAddress}:3000/api/test`);
      if (response.ok) {
        this.backendAnswer = await response.text();
      }
    } catch (error) {
      console.log(`Fetch API Error: ${error.message}`);
    }
  },
  components: { ConnectionManager, ConnectionState },
};
</script>
