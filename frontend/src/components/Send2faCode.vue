<template>
  <div class="twofa-input">
    <input type="text" v-model="code" :placeholder="$t('twoFAEnterCode')" />
    <button @click="verifyCode">
      {{ $t("twoFAVerify") }}
    </button>
  </div>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      code: "",
    };
  },

  methods: {
    async verifyCode() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/2fa/authenticate`,
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
          if (localStorage.getItem("access_token") === "") {
            const responseData = await response.json();
            localStorage.setItem("access_token", responseData["access_token"]);
            localStorage.setItem("userId", responseData["userId"]);
            router.push("/");
          } else {
            this.twoFactorAuthEnabled = true;
            this.enable2fa();
          }
        } else {
          alert(this.$t("CodeInvalid"));
        }
      } catch (error) {
        alert(this.$t("ServerError"));
      }
    },

    async enable2fa() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/2fa/enable`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (response.ok) {
          alert(this.$t("TwoFactorAuthEnabled"));
          router.push("/profile");
        }
      } catch (error) {
        alert(this.$t("ServerError"));
      }
    },
  },
};
</script>

<style scoped>
.twofa-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.twofa-input input {
  margin: 1em 0;
}
</style>
