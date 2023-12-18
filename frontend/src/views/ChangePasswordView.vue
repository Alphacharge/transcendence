<template>
  <div class="form-container">
    <form @submit.prevent="sendPostRequest" class="mx-auto w-50">
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

          if (data.success) {
            alert("Password changed successfully!");
            router.push("profile");
          } else {
            alert(data.message);
          }
        } else {
          alert("Failed to change password. Please try again.");
        }
      } catch (error) {
        alert("Password change failed!");
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
</style>
