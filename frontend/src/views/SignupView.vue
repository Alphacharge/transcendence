<template>
  <div>
    <h1>This is the Sign-Up frontend</h1>
  </div>
  <form @submit.prevent="sendPostRequest" class="mx-auto w-50">
    <div class="mb-3">
      <label for="Username" class="form-label"
        ><h5>{{ $t("Username") }}</h5></label
      ><br />
      <input
        v-model="username"
        type="text"
        class="form-control"
        id="Username"
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
    <div class="mb-3">
      <label for="InputPasswordrep" class="form-label"
        ><h5>{{ $t("RepeatPassword") }}</h5></label
      >
      <input
        v-model="rePassword"
        type="password"
        class="form-control"
        id="InputPasswordrep"
      />
    </div>
    <button type="submit" class="btn btn-primary" :disabled="isDisabled">
      {{ $t("Submit") }}
    </button>
    <button type="submit" class="btn btn-primary" @click.prevent="authorize">
      {{ $t("signupWithIntra") }}
    </button>
  </form>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      username: "",
      password: "",
      rePassword: "",
    };
  },
  computed: {
    isDisabled() {
      return !(this.rePassword && this.password === this.rePassword);
    },
  },
  methods: {
    async sendPostRequest() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/auth/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
            }),
          },
        );

        const responseData = await response.json();
        if (response.ok) {
          //maybe not needed anymore
          if (localStorage.getItem("access_token"))
            localStorage.removeItem("access_token");
          if (localStorage.getItem("userId")) localStorage.removeItem("userId");
          localStorage.setItem("access_token", responseData["access_token"]);
          localStorage.setItem("userId", responseData["userId"]);
          router.push("/");
        } else {
          alert("User exists!");
          router.push("/signup");
        }
      } catch (error) {
        alert("Signup failed!");
        router.push("/signup");
      }
    },
    async authorize() {
      const redirectUri = `https://${process.env.VUE_APP_BACKEND_IP}:3000/auth/42/callback`;
      const scope = `${process.env.VUE_APP_SCOPE}`;
      const authorizationEndpoint = "https://api.intra.42.fr/oauth/authorize";
      const state = `${process.env.VUE_APP_STATE}`;
      const queryParams = new URLSearchParams({
        client_id: `${process.env.VUE_APP_FORTYTWO_APP_ID}`,
        redirect_uri: redirectUri,
        scope: scope,
        state: state,
        response_type: "code",
      });
      const authorizationUrl = `${authorizationEndpoint}?${queryParams}`;
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        console.error(
          `LOGIN_VIEW, AUTHORIZE, problems with authorizationUrl: authorizationUrl=${authorizationUrl}`,
        );
      }
    },
  },
};
</script>
