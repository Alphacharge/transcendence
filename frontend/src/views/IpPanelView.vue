<template>
  <div>
    <p>Your machine's IP address is: {{ ipAddress }}</p>
    <p>
      Your machine's IP address is:
      <a :href="`https://${ipAddress}:${backendPort}`"
        >https://{{ ipAddress }}:{{ backendPort }}</a
      >
    </p>
    <p>
      Your machine's IP address is:
      <a :href="`https://localhost:${backendPort}`"
        >https://localhost:{{ backendPort }}</a
      >
    </p>
    <p>
      Your machine's IP address is:
      <a :href="`https://${ipAddress}:${frontendPort}`"
        >https://{{ ipAddress }}:{{ frontendPort }}</a
      >
    </p>
    <p>
      Your machine's IP address is:
      <a href="`https://localhost:${frontendPort}`"
        >https://localhost:{{ frontendPort }}</a
      >
    </p>
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
      ipAddress: null,
    };
  },
  created() {
    this.ipAddress = process.env.VUE_APP_SERVER_IP;
    this.backendPort = process.env.VUE_APP_BACKEND_PORT;
    this.frontendPort = process.env.VUE_APP_FRONTEND_PORT;
    if (!this.ipAddress) {
      this.ipAddress = "VUE_APP_SERVER_IP needed in .env file";
    }
  },
  components: { ConnectionManager, ConnectionState },
};
</script>
