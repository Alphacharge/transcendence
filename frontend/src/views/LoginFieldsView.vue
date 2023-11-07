<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Log In</button>
      <button type="button" @click="signup">Sign Up</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      const apiUrl = `http://${process.env.VUE_APP_BACKEND_IP}:3000/api/auth/login`;
      const requestBody = {
        username: this.username,
        password: this.password,
      };

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(`Fetch API error:`, error);
        });
    },
    signup() {
      const apiUrl = `http://${process.env.VUE_APP_BACKEND_IP}:3000/api/auth/signup`;
      const requestBody = {
        username: this.username,
        password: this.password,
      };

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(`Fetch API error:`, error);
        });
    },
  },
};
</script>
