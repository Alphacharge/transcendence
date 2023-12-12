<template>
  <div class="input">
        <input type="text" v-model="code" :placeholder="$t('twoFAEnterCode')" />
        <router-link to="/">
          <button @click="verifyCode">
            {{ $t("twoFAVerify")}}
          </button>
        </router-link>
      </div>
</template>

<script>
import router from '@/router';

export default {
  data() {
    return {
      code: "",
      twoFactorStatus: "",
      twoFactorEnabled: false,
    };
  },

  methods: {
    async verifyCode() {
      try {
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
          if (localStorage.getItem("access_token") === ""){
            const responseData = await response.json();
            localStorage.setItem("access_token", responseData["access_token"]);
            localStorage.setItem("userId", responseData["userId"]);
            
            router.push("/");
          } else {
            this.twoFactorStatus = "Code verified.";
            this.twoFactorAuthEnabled = true;
            this.enable2fa();
          }
        } else {
          this.twoFactorStatus =
            "Code could not be verified. Please try again.";
        }
      } catch (error) {
        console.error("Error verifying 2FA code:", error.message);
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
          this.twoFactorEnabled = false;
        }
      } catch (error) {
        console.error("Error enabling 2FA:", error.message);
      }
    },
  },
};
</script>
<style>
.input {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input input {
  margin: 1em 0;
}
</style>