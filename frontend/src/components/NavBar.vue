<template>
  <router-link to="/"
    ><img src="/favicon.ico" alt="favicon" class="navbar-brand-icon"
  /></router-link>
  <button
    class="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarNav"
    aria-controls="navbarNav"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav flex-grow-1">
      <li class="nav-item flex-grow-1">
        <router-link to="/pong" class="nav-link">{{ $t("Game") }}</router-link>
      </li>
      <li class="nav-item flex-grow-1">
        <router-link to="/tournament" class="nav-link">{{
          $t("Tournament")
        }}</router-link>
      </li>
      <li class="nav-item flex-grow-1">
        <router-link to="/statistic" class="nav-link">{{
          $t("Statistics")
        }}</router-link>
      </li>
      <li class="nav-item flex-grow-1">
        <router-link to="/ip" class="nav-link">IP-Panel</router-link>
      </li>
      <li class="nav-item flex-grow-1">
        <router-link to="/login" class="nav-link">{{
          $t("LogIn")
        }}</router-link>
      </li>
      <li class="nav-item flex-grow-1">
        <router-link to="/signup" class="nav-link">{{
          $t("SignUp")
        }}</router-link>
      </li>
      <li class="nav-item flex-grow-1">
        <router-link to="/about" class="nav-link">{{
          $t("About")
        }}</router-link>
      </li>
    </ul>
  </div>
  <LanguageToggle></LanguageToggle>
</template>

<script>
import LanguageToggle from "@/components/LanguageToggle.vue";

export default {
  components: { LanguageToggle },
};
</script>
