<template>
    <div class="nickname">
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
  .nickname {
    text-align: center;
  }
  </style>
  