<template>
  <div class="form-container">
    <form @submit.prevent="sendPostRequest" class="mx-auto w-50">
      <div v-if="success" class="mb-3 message-ok">
        {{ $t(`error.${this.message}`) }}
      </div>
      <div v-if="!success && message" class="mb-3 message-error">
        {{ $t(`error.${this.message}`) }}
      </div>
      <div class="mb-3">
        <label for="OldPassword" class="form-label"
          ><h5>{{ $t("OldPassword") }}</h5></label
        ><br />
        <input
          v-model="oldPassword"
          type="password"
          class="form-control"
          id="OldPassword"
        />
      </div>
      <div class="mb-3">
        <label for="InputPassword" class="form-label"
          ><h5>{{ $t("NewPassword") }}</h5></label
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
          ><h5>{{ $t("RepeatNewPassword") }}</h5></label
        >
        <input
          v-model="rePassword"
          type="password"
          class="form-control"
          id="InputPasswordrep"
        />
      </div>
      <div class="row justify-content-between">
        <div class="col">
          <button type="submit" class="btn btn-primary" :disabled="isDisabled">
            {{ $t("ChangePassword") }}
          </button>
        </div>
        <div class="col-auto"></div>
      </div>
    </form>
  </div>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      oldPassword: "",
      password: "",
      rePassword: "",
      success: false,
      message: "",
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
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/auth/password-change`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
              oldPassword: this.oldPassword,
              newPassword: this.password,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          this.success = data.success;
          this.message = data.message;
        }
      } catch (error) {
        this.success = false;
        this.message = "60";
      }
      if (this.success){
        setTimeout(() => {router.push('/profile');
        }, 3000);
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
.message-error {
  color: red;
  padding-bottom: 1em;
}
.message-ok {
  color: green;
  padding-bottom: 1em;
}
</style>
