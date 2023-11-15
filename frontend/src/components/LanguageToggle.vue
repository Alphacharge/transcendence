<template>
  <button @click="toggleLanguage" class="btn btn-primary">
    {{ currentLanguage }}
  </button>
</template>

<script>
export default {
  data() {
    return {
      currentLanguage: "EN", // Initial language, assuming English is default
      languages: ["EN", "DE", "PLACEHOLDER"], // Array of available languages
    };
  },
  methods: {
    toggleLanguage() {
      const currentIndex = this.languages.indexOf(this.currentLanguage);
      const nextIndex = (currentIndex + 1) % this.languages.length;
      this.currentLanguage = this.languages[nextIndex];

      // Set the corresponding locale based on the current language
      switch (this.currentLanguage) {
        case "EN":
          this.$i18n.locale = "en";
          break;
        case "DE":
          this.$i18n.locale = "de";
          break;
        case "PLACEHOLDER":
          this.$i18n.locale = "PLACEHOLDER"; // Adjust this to your third language code
          break;
        default:
          this.$i18n.locale = "en"; // Default to English if language code is unrecognized
          break;
      }
    },
  },
};
</script>
