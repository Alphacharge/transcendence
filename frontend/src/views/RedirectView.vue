<template>
  <div class="redirect">
    <p>{{ access_token }}, {{ userId }}</p>
  </div>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      access_token: "",
      userId: "",
    };
  },

  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get("access_token");
    const userId = urlParams.get("userId");
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("userId", userId);

    if (urlParams.get("twoFactorEnabled") == "true") {
      router.push("/2fa-code");
    } else {
      router.push("/");
    }
  },
};
</script>
