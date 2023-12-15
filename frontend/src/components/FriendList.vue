<template>
  <div class="patch-right">
    <div class="friend-list" :class="{ 'friend-list-visible': listStatus }">
      <ul>
        <li>
          <div class="add-friend" @click="openFriendSelectionModal">
            {{ $t("AddFriends") }}
          </div>
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
    <div>
      <friend-selection-modal
        ref="friendSelectionModal"
        :nonFriends="nonFriends"
        @add-friends="handleFriendsAdded"
      ></friend-selection-modal>
    </div>
    <div class="friendlist-icon" @click="toggleFriendListStatus">
      <img
        class="friendlist-icon-img"
        :src="listStatus ? getFriendCloseSrc() : getFriendOpenSrc()"
        alt="Friendlist"
      />
    </div>
  </div>
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
      listStatus: false,
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
    toggleFriendListStatus() {
      this.listStatus = !this.listStatus;
      if (this.listStatus) {
        document.body.classList.add("friend-list-visible");
      } else {
        document.body.classList.remove("friend-list-visible");
      }
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
    getFriendOpenSrc() {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/status/open.png`;
    },
    getFriendCloseSrc() {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/status/close.png`;
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
body.friend-list-visible {
  overflow-x: hidden;
}
.friendlist-icon {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: 0.5em;
  z-index: 2;
  cursor: pointer;
}

.friendlist-icon-img {
  transform: scale(0.5);
}
.friend-list {
  color: rgb(144, 154, 163);
  display: flex;
  flex-direction: column;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  overflow-x: hidden;
  position: fixed;
  top: 5em;
  bottom: 0;
  right: 2.5em;
  margin-top: 1em;
  width: 25em;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.friend-list li {
  display: flex;
  justify-content: left;
  width: 100%;
  margin-bottom: 1em;
  align-items: center;
}
.friend-name {
  flex-grow: 1;
  color: rgb(144, 154, 163);
}
.add-friend {
  flex-grow: 1;
  color: rgb(144, 154, 163);
  align-items: center;
  padding-top: 1em;
}
.friend-list ul {
  list-style-type: none;
  margin: 0 0;
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
  object-fit: cover;
  transform: scale(1);
}
.image_friends_status {
  left: 15em;
  margin-left: auto;
  margin-right: 1em;
}
.image_friends_add {
  margin-right: 1em;
}
.image_friends_remove {
  margin-right: 1em;
}

.friend-list.friend-list-visible {
  transform: translateX(0);
  overflow-x: auto;
}
.friend-list-visible .patch-right {
  /* background-color: rgb(15, 15, 30, 0.9); */
  min-width: 25em;
  flex-grow: 0.8;
}
.patch-right {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
}
</style>
