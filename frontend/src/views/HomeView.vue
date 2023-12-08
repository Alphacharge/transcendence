<template>
 <h1>Please choose your game mode</h1>
  <div class="Wrapper">
    <div class="ButtonsWrapper">
      <router-link class="ButtonBox nav-link navbar-nav" to="/pong" >{{ $t("Game")}}</router-link>
      <router-link class="ButtonBox nav-link" to="/localgame" >{{ $t("LocalGame")}}</router-link>
      <router-link class="ButtonBox nav-link" to="/tournament" >{{ $t("Tournament")}}</router-link>
    </div>
    <div class="FriendListBox">
      <FriendList />
    </div>
  </div>
</template>

<script>
import FriendList from "@/components/FriendList.vue";

export default {
  components: { FriendList },
  methods: {
    handleButtonClick(message) {
      alert(message);
    }
  }
};
</script>

<style scoped>
.Wrapper {
  display: flex;
  flex-wrap: wrap;
  height: 90%;
  width: 100%;
}

.ButtonsWrapper {
  display: flex;
  flex-direction: column;
  color: rgb(144, 154, 163);
  height: 100%;
  flex: 1;
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
  background-color:rgb(237, 211, 12);
}

.FriendListBox {
  flex: 0.5;
  background-color: lightgray;
  border: 1px solid gray;
  font-size: 24px;
  margin: 5px;
  display: flex;
  opacity: 0.6;
}
</style>
