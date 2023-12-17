<template>
  <div class="twofactorauth">
    <div>2FA</div>
    <div :class="twofaClass">
      {{ twoFAText(twoFactorAuthEnabled) }}
    </div>
    <button
      class="twofa-button"
      v-if="twoFactorAuthEnabled"
      @click="disable2FA"
    >
      {{ $t("twoFAdisable") }}
    </button>
    <router-link v-if="!twoFactorAuthEnabled" to="2fa-enable">
      <button class="twofa-button">
        {{ $t("twoFAenable") }}
      </button>
    </router-link>
    <router-link to="ChangePassword">
      <img class="pw-icon" :src="getPWSrc()" alt="Change PW" />
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userProfil: null,
      userHistory: null,
      twoFactorAuthEnabled: false,
      code: "",
    };
  },

  mounted() {
    this.checkTwoFactorAuthStatus();
  },
  computed: {
    twofaClass() {
      return {
        "twofa-enabled": this.twoFactorAuthEnabled,
        "twofa-disabled": !this.twoFactorAuthEnabled,
      };
    },
  },
  methods: {
    twoFAText(enabled) {
      return enabled ? this.$t("twoFAenabled") : this.$t("twoFAdisabled");
    },
    async checkTwoFactorAuthStatus() {
      try {
        const response = await fetch(
          `https://${process.env.SERVER_IP}:${process.env.BACKEND_PORT}/2fa/status`,
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
    getPWSrc() {
      return `https://${process.env.SERVER_IP}:${process.env.FRONTEND_PORT}/status/pw_change.png`;
    },
    async disable2FA() {
      try {
        const response = await fetch(
          `https://${process.env.SERVER_IP}:${process.env.BACKEND_PORT}/2fa/disable`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (response.ok) {
          this.twoFactorAuthEnabled = false;
        }
      } catch (error) {
        console.error("Error disabling 2FA:", error.message);
      }
    },
  },
};
</script>
<style scoped>
.twofactorauth {
  width: 6em;
  text-align: center;
}

.twofa-button {
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: center;
}

.twofa-enabled {
  background-color: green;
}

.twofa-disabled {
  background-color: red;
}

.pw-icon {
  width: 3em;
  height: 3em;
  margin-top: 0.5em;
  position: relative;
  object-fit: cover;
  transform: scale(1);
}
</style>
