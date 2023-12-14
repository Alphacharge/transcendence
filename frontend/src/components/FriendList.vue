<template>
  <div class="friend-list">
    <ul>
      <li>
        <div class="add-friend" @click="addFriend">{{ $t("AddFriends") }}</div>
        <div class="image_friends_add" @click="openFriendSelectionModal">
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
        <div class="friend-name">
          {{ friend.username }}
        </div>
        <div class="image_friends_status">
          <img
            style="width: 16px; height: auto"
            :src="getStatusSrc(friend.status)"
            alt="Status"
          />
        </div>
        <div class="image_friends_remove" @click="removeFriend(friend.id)">
          <img
            style="width: 16px; height: auto"
            :src="getCrossSrc()"
            alt="rmFriend"
          />
        </div>
      </li>
    </ul>
  </div>
  <friend-selection-modal
    ref="friendSelectionModal"
    :nonFriends="nonFriends"
    @add-friends="handleFriendsAdded"
  ></friend-selection-modal>
</template>

<script>
import FriendSelectionModal from "./FriendSelectionModal.vue";

export default {
  components: { FriendSelectionModal },
  data() {
    return {
      isMouseOver: false,
      friends: null,
      nonFriends: [],
    };
  },
  mounted() {
    this.getUsersFriends();
  },
  methods: {
    async getUsersFriends() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/friends`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (response.ok) {
          const responseData = await response.json();
          this.friends = responseData.friends;
        } else {
          console.error("Failed to fetch friends");
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    },
    async getUsersNonFriends() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/nofriends`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (response.ok) {
          const responseData = await response.json();
          this.nonFriends = responseData.friends;
        } else {
          console.error("Failed to fetch nofriends");
        }
      } catch (error) {
        console.error("Error fetching nofriends:", error);
      }
    },
    async removeFriend(friendId) {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/removefriend`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
              friendId: friendId,
            }),
          },
        );

        if (response.ok) {
          const responseData = await response.json();
          this.friends = responseData.friends;
        } else {
          console.error("Failed to remove friend");
        }
      } catch (error) {
        console.error("Error removing friend:", error);
      }
    },
    async openFriendSelectionModal() {
      try {
        await this.getUsersNonFriends();

        if (this.$refs.friendSelectionModal) {
          this.$refs.friendSelectionModal.showModal = true;
        } else {
          console.error("FriendSelectionModal ref is not defined");
        }
      } catch (error) {
        console.error("Error fetching non-friends:", error);
      }
    },
    handleFriendsAdded() {
      this.getUsersFriends();
    },
    getAvatarSrc(avatar) {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/avatars/${avatar.id}${avatar.mime_type}`;
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
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}
.friend-list li {
  display: flex;
  justify-content: left;
  width: 100%;
  margin-bottom: 1em;
  /* text-align: left; */
}
.friend-name {
  flex-grow: 1;
  color: rgb(217, 217, 229);
}
.add-friend {
  flex-grow: 1;
  color: rgb(217, 217, 229);
}
.friend-list ul {
  list-style-type: none;
}
.image_friends {
  width: 48px;
  height: 48px;
  margin-right: 1em;
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
.image_friends_status {
  left: 15em;
  margin-left: auto;
  margin-right: 1em;
}
.image_friends_remove {
  margin-right: 1em;
}
</style>
