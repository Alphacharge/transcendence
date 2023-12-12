<template>
  <div class="container">
  <Send2faCode></Send2faCode>
  </div>
</template>

<script>
import Send2faCode from "@/components/Send2faCode.vue";

export default {
  components: {
    Send2faCode,
  },
};
</script>
<style>
.container {
  margin-top: 4em;
}
</style>
