<template>
  <div class="twofactorauth">
    <div>
      2FA
    </div>
    <div :class="twofaClass">
      {{ twoFAText(twoFactorAuthEnabled) }}
    </div>
    <button class="button" v-if="twoFactorAuthEnabled" @click="disable2FA">
      {{ $t("twoFAdisable") }}
    </button>
    <router-link v-if="!twoFactorAuthEnabled" to="2fa-enable">
      <button class="button">
        {{ $t("twoFAenable")}}
      </button>
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
        'enabled': this.twoFactorAuthEnabled,
        'disabled': !this.twoFactorAuthEnabled,
      };
    },
  },
  methods: {
    twoFAText(enabled) {
      return enabled ? this.$t('twoFAenabled') : this.$t('twoFAdisabled');
    },
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
          this.twoFactorAuthEnabled = false;
        }
      } catch (error) {
        console.error("Error disabling 2FA:", error.message);
      }
    },
  },
};
</script>
<style>
.twofactorauth {
  width: 4em;
  text-align: center;
}

.button {
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: center;
}

.enabled {
  background-color: green;
}

.disabled {
  background-color: red;
}
</style>