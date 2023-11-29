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
    <button type="submit" class="btn btn-primary">
      {{ $t("Submit") }}
    </button>
    <button type="submit" class="btn btn-primary" @click.prevent="authorize">
      {{ $t("loginWithIntra") }}
    </button>
  </form>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      inputEmail: "",
      password: "",
      apiRequest: false,
      eventSource: null,
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
        window.location.href = authorizationUrl;
      } else {
        console.error(
          `LOGIN_VIEW, AUTHORIZE, problems with authorizationUrl: authorizationUrl=${authorizationUrl}`,
        );
      }
      this.startSSEListener();
    },
    startSSEListener() {
      this.eventSource = new EventSource('/auth/42/callback'); // Replace with your SSE endpoint
      this.eventSource.addEventListener('OAuthCompletion', (event) => {
        console.log('OAuth process completed');
        const eventData = event.data;
        this.eventSource.close(); // Close the SSE connection after receiving the completion event
        this.setResponse(eventData);
        // Proceed with further actions after OAuth completion
      });
      this.eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        this.eventSource.close(); // Close the SSE connection on error
      };
    },
    async setResponse(response) {
      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("access_token", responseData["access_token"]);
        localStorage.setItem("userId", responseData["userId"]);
        router.push("/");
      } else {
        alert("User or Password wrong!");
      }
    },
  },
  beforeUnmount() {
    if(this.eventSource) {
      this.eventSource.close();
    }
  }
};
</script>
