<template>
  <!-- v-if="showFriendList" -->
  <div class="friend-list">
    <ul>
      <li>
        <div>Add Friends</div>
        <div class="image_friends_add">
          <img
            style="width: 16px; height: auto"
            :src="getPlusSrc()"
            alt="addFriend"
          />
        </div>
      </li>
    </ul>
    <ul>
      <li v-for="friend in friends" :key="friend.id">
        <div class="image_friends">
          <img :src="getAvatarSrc(friend.avatar)" alt="Avatar" />
        </div>
        <div>{{ friend.nick }}</div>
        <div class="image_friends_status">
          <img
            style="width: 16px; height: auto"
            :src="getStatusSrc(friend.status)"
            alt="Status"
          />
        </div>
        <div class="image_friends_remove">
          <img
            style="width: 16px; height: auto"
            :src="getCrossSrc()"
            alt="rmFriend"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMouseOver: false,
      friends: null,
    };
  },
  mounted() {
    // Make a call to your NestJS backend when the component is mounted
    this.getUsersFriends();
  },
  methods: {
    async getUsersFriends() {
      try {
        // Replace 'YOUR_BACKEND_URL' with the actual URL of your NestJS backend
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/friends`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: localStorage.getItem("userId"),
            }),
          },
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          this.friends = responseData.friends;
          // Handle the user history data as needed
        } else {
          console.error("Failed to fetch friends");
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    },
    getAvatarSrc(avatar) {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/avatar/${avatar}.png`;
    },
    getStatusSrc(status) {
      if (status) {
        return `https://${process.env.VUE_APP_BACKEND_IP}:8080/status/on.png`;
      }
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/status/off.png`;
    },
    getCrossSrc() {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/status/cross.png`;
    },
    getPlusSrc() {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/status/plus.png`;
    },
    handleMouseEnter() {
      this.isMouseOver = true;
    },
    handleMouseLeave() {
      this.isMouseOver = false;
    },
  },
};
</script>

<style scoped>
.friend-list {
  position: fixed;
  width: 20%;
  height: 100%;
  top: 60px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
}
.friend-list ul {
  list-style-type: none;
}
.image_friends {
  width: 48px;
  height: 48px;
  overflow: hidden;
  display: inline-block;
  position: relative;
}

.image_friends img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This property ensures the image fills the 32x32 container without distorting its aspect ratio */
  transform: scale(
    1
  ); /* Scale the image down to fit within the 32x32 container */
}
</style>
