<template>
  <div class="patch-wrapper">
    <div class="patch-left">
      <UserProfile />
    </div>
      <FriendList />
  </div>
</template>

<script>
import FriendList from "@/components/FriendList.vue";
import UserProfile from "@/components/UserProfile.vue";

export default {
  components: { FriendList, UserProfile },
};
</script>

<style scoped>
.patch-wrapper {
  display: flex;
  justify-content: space-between;
  background: transparent;
  flex-wrap: wrap;
}
.patch-left {
  flex-grow: 1;
}

</style>
