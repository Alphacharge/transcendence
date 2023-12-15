<template>
  <button @click="toggleLanguage" class="btn btn-primary">
    {{ currentLanguage }}
  </button>
</template>

<script>
import { checkLoggedIn } from "@/services/authService";
import { selectLanguage } from "@/services/languageService";

export default {
  data() {
    return {
      currentLanguage: "EN", // Initial language, assuming English is default
      languages: ["EN", "DE", "IT"], // Array of available languages
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

      // parse the input and set it in local storage
      const parsedLanguage = selectLanguage(this.currentLanguage);

      // save new language in backend
      try {
        const amILoggedIn = await checkLoggedIn();
        console.log("amILoggedIn:", amILoggedIn);
        if (amILoggedIn) {
          await this.saveLanguagePreference(parsedLanguage);
        }
      } catch (error) {
        console.error("Error occured while saving language preference:", error);
      }

      this.$i18n.locale = parsedLanguage;
    },

    async saveLanguagePreference(language) {
      console.log("saveLanguagePreference:", language);
      console.log("json output:", JSON.stringify({ newLanguage: language }));
      try {
        await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/setlanguage`,
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
