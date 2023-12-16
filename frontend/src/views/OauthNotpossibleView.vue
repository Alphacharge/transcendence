<template>
  <div class="message">
    <h1>Ooops, your intra login seems to be already used...</h1>
    <h3>Unfortunately, no double usernames are allowed by the subject.</h3>
    <h3>Therefore, if that's you, please consider changing the username to use intra login.</h3>
    <h3>If not, please contact the developer.</h3>
</div>
</template>

<script>
import router from "@/router";
export default {
  data() {
    return {
    };
  },
  beforeUnmount() {
    alert("You'll be sent back to the login page.");
  },
  mounted() {
    router.push("/login");
  }

};
</script>

<style scoped>
.message {
  text-align: center;
  color: rgb(219, 219,227);
}
</style>
