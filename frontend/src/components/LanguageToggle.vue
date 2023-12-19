<template>
  <button @click="toggleLanguage" class="btn btn-primary">
    {{ $t("currentLanguage") }}
  </button>
</template>

<script>
import { checkLoggedIn } from "@/services/authService";

export default {
  data() {
    return {
      currentLanguage: "en", // Initial language, assuming English is default
      languages: ["en", "de", "it"], // Array of available languages
    };
  },

  mounted() {
    this.checkLanguage();
  },

  methods: {
    checkLanguage() {
      const savedLanguage = localStorage.getItem("userLanguage");
      if (savedLanguage) {
        this.currentLanguage = savedLanguage.toUpperCase();
      }
    },

    async toggleLanguage() {
      const currentIndex = this.languages.indexOf(this.currentLanguage);
      const nextIndex = (currentIndex + 1) % this.languages.length;

      this.currentLanguage = this.languages[nextIndex];
      localStorage.setItem("userLanguage", this.currentLanguage);

      // save new language in backend
      try {
        const amILoggedIn = await checkLoggedIn();

        if (amILoggedIn) {
          await this.saveLanguagePreference(this.currentLanguage);
        }
      } catch (error) {
        console.error("Error occured while saving language preference:", error);
      }

      this.$i18n.locale = this.currentLanguage;
    },

    async saveLanguagePreference(language) {
      try {
        await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/data/setlanguage`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newLanguage: language }),
          },
        );
      } catch (error) {
        throw new Error("Failed to save language preference");
      }
    },
  },
};
</script>
