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
        <div class="ToggleFriendListButton" @click="toggleFriendList">
        {{ isFriendListOpen ? 'Hide' : 'Show' }} Friend List
      </div>
    </div>
    <div class="FriendListBox" v-show="isFriendListOpen">
      <FriendList />
    </div>
  </div>
</template>

<script>
import FriendList from "@/components/FriendList.vue";

export default {
  components: { FriendList },
  data() {
    return {
      isFriendListOpen: true, // Initial state, adjust as needed
    };
  },
  methods: {
    toggleFriendList() {
      this.isFriendListOpen = !this.isFriendListOpen;
    },
    handleButtonClick(message) {
      alert(message);
    },
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
  flex-direction: column;
  color: rgb(144, 154, 163);
  height: 100%;
  flex: 2;
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

.FriendListBox {
  display: flex;
  margin: 5px;
  height: 100%;
  flex-direction: column;
  flex-grow: 0.8;
}
.ToggleFriendListButton {
  cursor: pointer;
  background-color: transparent;
  border: 0.5px solid rgb(237, 211, 12);
  background-color: blueviolet;
  font-size: 18px;
  margin: 5px;
  padding: 5px;
  display: inline-block;
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 1; /* Ensure the button is above other elements */
  transition: background-color 0.3s ease;
}

.ToggleFriendListButton:hover {
  background-color: rgb(237, 211, 12);
}

</style>
