<template>
  <div>
    <div>
      <UserProfile />
    </div>
    <div>
      <FriendList />
    </div>
  </div>
</template>

<script>
import FriendList from "@/components/FriendList.vue";
import UserProfile from "@/components/UserProfile.vue";

export default {
  components: { FriendList, UserProfile },
};
</script>
