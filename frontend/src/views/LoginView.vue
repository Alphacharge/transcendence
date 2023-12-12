<template>
  <div class="form-container">
    <form @submit.prevent="sendPostRequest" class="mx-auto w-50">
      <div class="mb-3">
        <label for="Username" class="form-label"
          ><h5>{{ $t("Username") }}</h5></label
        >
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
      <div>
        {{ $t("or") }}
        <router-link to="/signup">{{ $t("SignUp") }}</router-link>
      </div>
      <div class="row justify-content-between">
        <div class="col">
          <button type="submit" class="btn btn-primary" :disabled="isDisabled">
            {{ $t("Submit") }}
          </button>
        </div>
        <div class="col-auto">
          <button
            type="submit"
            class="btn btn-primary"
            @click.prevent="authorize"
          >
            {{ $t("signupWithIntra") }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      username: "",
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
              username: this.username,
              password: this.password,
            }),
          },
        );
        this.setResponse(response);
      } catch (error) {
        alert("Login failed!");
        router.push("/login");
      }
    },
    authorize() {
      const authorizationEndpoint = "https://api.intra.42.fr/oauth/authorize";
      const redirectUri = `https://${process.env.VUE_APP_BACKEND_IP}:3000/auth/42/callback`;
      const scope = `${process.env.VUE_APP_SCOPE}`;
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
        // window.location.href = authorizationUrl;
        window.location.href = authorizationUrl;
      } else {
        console.error(
          `LOGIN_VIEW, AUTHORIZE, problems with authorizationUrl: authorizationUrl=${authorizationUrl}`,
        );
      }
    },
    async setResponse(response) {
      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("access_token", responseData["access_token"]);
        localStorage.setItem("userId", responseData["userId"]);
        if (responseData.requires2FA) {
          console.log("pushing 2fa");
          router.push("/2fa-code");
        } else {
          router.push("/");
        }
      } else {
        alert("User or Password wrong!");
      }
    },
  },
};
</script>
<style>
.form-container {
  width: 55%;
  margin-left: 25%;
  margin-top: 4em;
  color: rgb(217, 217, 229);
}
.form-container h3 {
  margin-bottom: 2em;
  text-align: center;
}

.form-container p {
  margin-bottom: 1.5em;
}

.form-container li {
  list-style: none;
}
.filler {
  flex-grow: calc();
}
</style>
