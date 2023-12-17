<template>
  <div class="twofa-container">
    <div class="twofa-content">
      <div class="twofa-qrcode">
        <qrcode-vue :value="otpauthUrl" :size="qrcodeSize" />
      </div>
      <Send2faCode />
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import Send2faCode from "@/components/Send2faCode.vue";

export default {
  components: {
    QrcodeVue,
    Send2faCode,
  },
  data() {
    return {
      otpauthUrl: "",
      code: "",
      qrcodeSize: 128,
    };
  },
  methods: {
    async generate2faSecret() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/2fa/generate`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (response.ok) {
          try {
            const responseData = await response.json();
            this.otpauthUrl = responseData.otpauthUrl;
          } catch (jsonError) {
            console.error("JSON parsing error:", jsonError);
          }
        }
      } catch (error) {
        console.error("Error generating code:", error.message);
      }
    },
  },
  mounted() {
    this.generate2faSecret();
  },
};
</script>
<style scoped>
.twofa-container {
  margin-top: 4em;
  width: 100%; /* Adjust as needed */
  display: flex;
  justify-content: center;
}

.twofa-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.twofa-qrcode {
  background-color: white;
  padding-top: 0.5em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  padding-bottom: 0.1em;
  margin-bottom: 1em; /* Add spacing between QR code and input */
}
</style>
