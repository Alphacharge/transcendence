<template>
  <div>
    <h1>This is the Log-In frontend</h1>
  </div>
  <form @submit.prevent="sendPostRequest" class="mx-auto w-50">
    <div class="mb-3">
      <label for="InputEmail" class="form-label"
        ><h5>{{ $t("EmailAddress") }}</h5></label
      >
      <input
        v-model="inputEmail"
        type="email"
        class="form-control"
        id="InputEmail"
        aria-describedby="email"
      />
    </div>
    <div class="mb-3">
      <label for="InputPassword" class="form-label"
        ><h5>{{ $t("Password") }}</h5></label
      >
      <input
        v-model="password"
        type="password"
        class="form-control"
        id="InputPassword"
      />
    </div>
    <div>
      {{ $t("or") }} <router-link to="/signup">{{ $t("SignUp") }}</router-link>
    </div>
    <button type="submit" class="btn btn-primary">{{ $t("Submit") }}</button>
  </form>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      inputEmail: "",
      password: "",
    };
  },
  methods: {
    async sendPostRequest() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.inputEmail,
              password: this.password,
            }),
          },
        );

        const responseData = await response.json();
        if (response.ok) {
          localStorage.setItem("access_token", responseData["access_token"]);
          localStorage.setItem("userId", responseData["userId"]);
          router.push("/");
        } else {
          alert("User or Password wrong!");
        }
      } catch (error) {
        alert("Login failed!");
        router.push("/login");
      }
    },
  },
};
</script>
