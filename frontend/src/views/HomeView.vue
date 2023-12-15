<template>
  <div class="Wrapper">
    <div class="ButtonsWrapper">
      <router-link class="ButtonBox nav-link navbar-nav" to="/remotegame">{{
        $t("Game")
      }}</router-link>
      <router-link class="ButtonBox nav-link" to="/localgame">{{
        $t("LocalGame")
      }}</router-link>
      <router-link class="ButtonBox nav-link" to="/tournament">{{
        $t("Tournament")
      }}</router-link>
    </div>
    <FriendList />
  </div>
</template>

<script>
import FriendList from "@/components/FriendList.vue";
import { fetchUserLanguage, selectLanguage } from "@/services/languageService";

export default {
  components: { FriendList },

  async mounted() {
    try {
      let language = await fetchUserLanguage();

      selectLanguage(language);

      this.$i18n.locale = selectLanguage(language);
    } catch (error) {
      console.error("Error fetching preferred language");
    }
  },
};
</script>

<style scoped>
.Wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-top: 4em;
  height: 80%;
  width: 100%;
  flex: 2;
}

.ButtonsWrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  color: rgb(144, 154, 163);
  height: 100%;
  flex-grow: 1.3;
}

.ButtonBox {
  cursor: pointer;
  background-color: transparent;
  border: 0.5px solid rgb(237, 211, 12);
  /* height: 30%; */
  font-size: 24px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  flex-grow: 1;
}

.ButtonBox:hover {
  background-color: rgb(237, 211, 12);
}
</style>
