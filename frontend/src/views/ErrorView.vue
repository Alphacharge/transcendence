<template>
  <div class="message">
    <h1>{{ $t("Error") + " " + code }}</h1>
    <p class="errormessage">{{ errorMessage }}</p>
    <p>{{ $t("redirect") }}</p>
    <div v-if="currentCount > 0" class="clock">
      {{ currentCount }}
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from "vue";
import router from "@/router";

export default {
  props: {
    code: {
      type: String,
      required: true,
    },
  },

  computed: {
    errorMessage() {
      return this.$t(`error.${this.code}`);
    },
  },

  setup() {
    const currentCount = ref(5);

    const countdownInterval = setInterval(() => {
      if (currentCount.value > 0) {
        currentCount.value--;
      } else {
        clearInterval(countdownInterval);
        router.push("/login");
      }
    }, 1000);

    onBeforeUnmount(() => {
      clearInterval(countdownInterval);
    });

    return {
      currentCount,
    };
  },
};
</script>

<style scoped>
.message {
  margin-top: 4em;
  text-align: center;
  color: rgb(219, 219, 227);
}

.errormessage {
  margin: 2em 0;
  color: red;
}

.clock {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  text-align: center;
  font-size: 20em;
  color: rgb(217, 217, 229);
  z-index: 2;
}
</style>
