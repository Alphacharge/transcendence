<template>
  <div>
    <p>2FA enabled: {{ twoFactorAuthEnabled }}</p>
    <div>
      <button @click="generate2faSecret">
        Setup 2FA via Authenticator App
      </button>
      <button @click="disable2FA">Disable 2FA</button>
    </div>
    <div>
      <qrcode-vue :value="otpauthUrl" />
      <p>OTP: {{ otpauthUrl }}</p>
      <input type="text" v-model="code" placeholder="Enter your OTP code" />
      <button @click="verifyCode">Verify</button>
      <p>{{ twoFactorStatus }}</p>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

export default {
  components: {
    QrcodeVue,
  },

  data() {
    return {
      userProfil: null,
      userHistory: null,
      twoFactorAuthEnabled: false,
      otpauthUrl: "",
      code: "",
      twoFactorStatus: "",
    };
  },

  mounted() {
    this.checkTwoFactorAuthStatus();
  },

  methods: {
    async checkTwoFactorAuthStatus() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/2fa/status`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          this.twoFactorAuthEnabled = data.twoFactorEnabled;
        } else {
          console.error("Failed to fetch 2FA status:", response.status);
        }
      } catch (error) {
        console.error("Error checking 2FA status:", error.message);
      }
    },

    async generate2faSecret() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/2fa/generate`,
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

    async disable2FA() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/2fa/disable`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (response.ok) {
          this.twoFactorStatus = "2FA disabled successfully.";
          this.twoFactorEnabled = false;
        }
      } catch (error) {
        console.error("Error disabling 2FA:", error.message);
      }
    },

    async enable2fa() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/2fa/enable`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );
        if (response.ok) {
          this.twoFactorStatus = "2FA enabled successfully.";
          this.twoFactorEnabled = false;
        }
      } catch (error) {
        console.error("Error enabling 2FA:", error.message);
      }
    },

    async verifyCode() {
      try {
        console.log(
          "requesting 2fa verification for user",
          localStorage.getItem("userId"),
        );
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/2fa/authenticate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userId"),
              code: this.code,
            }),
          },
        );

        if (response.ok) {
          this.twoFactorStatus = "Code verified.";
          this.enable2fa();
        } else {
          this.twoFactorStatus =
            "Code could not be verified. Please try again.";
        }
      } catch (error) {
        console.error("Error verifying 2FA code:", error.message);
      }
    },
  },
};
</script>
