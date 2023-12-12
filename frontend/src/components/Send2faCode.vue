<template>
  <input type="text" v-model="code" placeholder="Enter your OTP code" />
  <button @click="verifyCode">Verify</button>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      code: "",
      twoFactorStatus: "",
    };
  },

  methods: {
    async verifyCode() {
      try {
        console.log("sending 2fa code");
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
          this.twoFactorStatus = "Code accepted.";

          const responseData = await response.json();
          localStorage.setItem("access_token", responseData["access_token"]);
          localStorage.setItem("userId", responseData["userId"]);

          router.push("/");
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
