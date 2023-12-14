<template>
  <div class="friend-selection-modal" v-if="showModal">
    <div class="modal-content">
      <ul>
        <li v-for="nonFriend in nonFriends" :key="nonFriend.id">
          <label class="content-add-friends">
            <div class="label-content">
              <div class="image_friends">
                <img :src="getAvatarSrc(nonFriend.avatar)" alt="Avatar" />
              </div>
              <div class="friend-name">
                <div>{{ nonFriend.username }}</div>
              </div>
              <div class="image_friends_status">
                <img
                  style="width: 16px; height: auto"
                  :src="getStatusSrc(nonFriend.status)"
                  alt="Status"
                />
              </div>
              <input
                type="checkbox"
                v-model="selectedFriends"
                :value="nonFriend"
              />
            </div>
          </label>
        </li>
      </ul>
      <button @click="addSelectedFriends">{{ $t("AddFriends") }}</button>
      <button @click="closeModal">{{ $t("closeList") }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nonFriends: Array, // Array of non-friend users
  },
  data() {
    return {
      showModal: false,
      selectedFriends: [],
    };
  },
  methods: {
    addSelectedFriends() {
      // Add logic to send a request to add selected friends
      const userId = localStorage.getItem("userId");
      const selectedFriendIds = this.selectedFriends.map((friend) => friend.id);

      // Send a request to your backend to add friends
      fetch(`https://${process.env.VUE_APP_BACKEND_IP}:3000/data/addfriends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          friendIds: selectedFriendIds,
        }),
      })
        .then((response) => {
          if (response.ok) {
            // Handle success, e.g., refresh the friend list
            this.getUsersFriends();
            // Optionally, you can emit an event to notify the parent component
            this.$emit("add-friends", this.selectedFriends);
          } else {
            console.error("Failed to add friends");
          }
        })
        .catch((error) => {
          console.error("Error adding friends:", error);
        });

      this.closeModal();
    },
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
    closeModal() {
      this.showModal = false;
      this.selectedFriends = [];
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
  },
};
</script>

<style scoped>
.friend-selection-modal {
  position: fixed;
  display: flex;
  flex-direction: column;
  color: rgb(1, 8, 51);
  top: 50%;
  left: 50%;
  width: 25em;
  max-height: 80%;
  overflow-y: auto;
  transform: translate(-50%, -50%);
  background-color: rgb(144, 154, 163, 0.9);
  padding: 1em;
  z-index: 1000;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.content-add-friends {
  flex: 1;
}
.label-content {
  display: flex;
  align-items: center;
}
.modal-content {
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: left;
  width: 100%;
  margin-bottom: 1em;
  margin-bottom: 1em;
}

.image_friends {
  width: 48px;
  height: 48px;
  overflow: hidden;
  display: inline-block;
  position: relative;
}

.image_friends_status {
  left: 15em;
  margin-left: auto;
  margin-right: 1em;
}

.friend-name {
  flex-grow: 1;
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
