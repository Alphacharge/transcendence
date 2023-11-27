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
    <button
      type="submit"
      class="btn btn-primary"
      >
      {{ $t("Submit") }}
    </button>
    <button
      type="submit"
      class="btn btn-primary"
      @click.prevent="authorize"
      >
      {{ $t("Authorize with 42") }}
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
    async authorize() {
      /*TODO: https sollte über .env gehen kriege es aber gerade nicht hin
      e.g. const authorizationUrl=`${process.env.AUTH_URL}*/
      const authorizationUrl="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-00df0bcc6de43b6037219a0bdd40cc161fa358149677d5c0036fbe5174a2190b&redirect_uri=https%3A%2F%2F127.0.0.1%3A3000%2Fauth%2F42%2Fcallback&response_type=code";
      if (authorizationUrl) {
        window.location.href=authorizationUrl;
        // console.log(`DEBUG authorizationUrl=${authorizationUrl}`);
      } else {
        console.error(`DEBUG process.env.AUTH_URL=${authorizationUrl}`);
      }
    },
  },
};
</script>
