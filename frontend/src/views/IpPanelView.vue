<template>
  <div>
    <p>Your machine's IP address is: {{ ipAddress }}</p>
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
    this.ipAddress = process.env.VUE_APP_BACKEND_IP;
    if (!this.ipAddress) {
      this.ipAddress = "VUE_APP_BACKEND_IP needed in .env file";
    }
  },
  components: { ConnectionManager, ConnectionState },
};
</script>
