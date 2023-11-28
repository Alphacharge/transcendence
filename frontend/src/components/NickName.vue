<template>
  <div class="username">
    <h2>{{ username }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    username: String, // Benutzername
  },
};
</script>

<style scoped>
.username {
  text-align: center;
}
</style>
