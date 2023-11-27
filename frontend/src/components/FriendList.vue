<template>
<div v-if="isMouseOver" class="friend-list">
    <ul>
      <li v-for="friend in friends" :key="friend.id">
        <div class="image_friends">
              <img :src="getAvatarSrc(friend.avatar)" alt="Avatar" />
        </div>
        <div>{{ friend.nick }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    friends: Array, // Array of friend objects
  },
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
      // Adjust the path as needed based on your avatar structure
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/avatar/${avatar}.png`;
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
  top: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
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