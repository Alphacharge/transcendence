<template>
  <div class="centered">
    <div>
      <div class="profile" v-if="userProfil">
        <div class="image-profile-container">
          <div class="image-profile">
            <img :src="getAvatarSrc(userProfil.avatar)" alt="Avatar" />
          </div>
          <img class="upload-icon" :src="getUploadSrc()" alt="Upload" />
          <div class="upload-icon" @click="openFileUpload">
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              accept=".jpg, .png"
              @change="uploadFile"
            />
          </div>
        </div>
        <div class="profile-data">
          <div v-if="showMessage" class="message">
            {{ $t(`error.${this.messageText}`) }}
          </div>
          <p v-if="!isEditing" class="text-color">
            <img
              class="edit-icon"
              :src="getEditSrc()"
              @click="startEditing"
              alt="Edit"
            />
            {{ userProfil.nickname }}
          </p>
          <input
            v-if="isEditing"
            v-model="editedNickname"
            @keyup.enter="saveNickname"
            @blur="saveNickname"
          />
          <p class="text-color">{{ $t("profileRegister") }}</p>
          <p class="text-color">{{ userProfil.createdAt.slice(0, 10) }}</p>
        </div>
        <div class="two-fa-auth">
          <Enable2FA></Enable2FA>
        </div>
      </div>
    </div>
    <div v-if="userHistory">
      <div class="ms-row">
        <div class="box">
          <div class="box-left">{{ $t("profileWins") }}:</div>
          <div class="box-right">{{ userMilestones.wins }}</div>
        </div>
        <div class="box">
          <div class="box-left">{{ $t("profileLos") }}:</div>
          <div class="box-right">{{ userMilestones.losses }}</div>
        </div>
      </div>
      <div class="ms-row">
        <div class="box">
          <div class="box-left">{{ $t("profileMatches") }}:</div>
          <div class="box-right">{{ userMilestones.matches }}</div>
        </div>
        <div class="box">
          <div class="box-left">{{ $t("profileTournament") }}:</div>
          <div class="box-right">{{ userMilestones.tourmatches }}</div>
        </div>
      </div>
      <div class="ms-row">
        <div class="box">
          <div class="box-left">{{ $t("profileContacts") }}:</div>
          <div class="box-right">
            {{ userMilestones.contacts[0].total_contacts }}
          </div>
        </div>
        <div class="box">
          <div class="box-left">{{ $t("profileTourWins") }}:</div>
          <div class="box-right">{{ userMilestones.tourwins }}</div>
        </div>
      </div>
      <div class="table-wrapper">
        <div
          class="score-table-line"
          v-for="match in userHistory"
          :key="match.id"
        >
          <div class="image-table">
            <div class="image_history">
              <img :src="getAvatarSrc(match.leftUser.avatar)" alt="Avatar" />
            </div>
          </div>
          <div class="name-table-left">
            {{ match.leftUser.nickname }}
          </div>
          <div class="score-table">
            <div class="score-table-left">
              {{ match.left_user_score }}
            </div>
            <div class="score-table-center">
              <b>:</b>
            </div>
            <div class="score-table-right">
              {{ match.right_user_score }}
            </div>
          </div>
          <div class="name-table-right">
            {{ match.rightUser.nickname }}
          </div>
          <div class="image-table">
            <div class="image_history">
              <img :src="getAvatarSrc(match.rightUser.avatar)" alt="Avatar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Enable2FA from "./Enable2FA.vue";

export default {
  data() {
    return {
      userProfil: null,
      isEditing: false,
      editedNickname: "",
      messageText: "",
      showMessage: false,
      userHistory: null,
      userMilestones: null,
    };
  },

  components: { Enable2FA },

  mounted() {
    this.fetchUserHistory();
  },

  methods: {
    async fetchUserHistory() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/data/userstats`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (response.ok) {
          const responseData = await response.json();
          this.userProfil = responseData.userProfil;
          this.userHistory = responseData.userHistory;
          this.userMilestones = responseData.userMilestones;
        } else {
          console.error("Failed to fetch user history");
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    },

    startEditing() {
      this.editedNickname = this.userProfil.nickname;
      this.isEditing = true;
    },

    async saveNickname() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/data/editname`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newNickname: this.editedNickname,
            }),
          },
        );
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.nickName) {
            this.userProfil.nickname = this.editedNickname;
            this.isEditing = false;
            this.showMessage = false;
          } else {
            this.showMessage = true;
            this.messageText = responseData.errorCode;
            setTimeout(() => {
              this.showMessage = false;
            }, 2000);
          }
        } else {
          this.showMessage = true;
          this.messageText = this.$t("nicknameError");
          setTimeout(() => {
            this.showMessage = false;
          }, 2000);
        }
      } catch (error) {
        this.showMessage = true;
        this.messageText = this.$t("nicknameError");
        setTimeout(() => {
          this.showMessage = false;
        }, 2000);
      }
    },

    getAvatarSrc(avatar) {
      return `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_FRONTEND_PORT}/avatars/${avatar.id}${avatar.mime_type}`;
    },

    getUploadSrc() {
      return `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_FRONTEND_PORT}/status/upload.png`;
    },

    getEditSrc() {
      return `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_FRONTEND_PORT}/status/edit.png`;
    },

    openFileUpload() {
      this.$refs.fileInput.click();
    },

    async uploadFile() {
      try {
        const fileInput = this.$refs.fileInput;
        const file = fileInput.files[0];

        if (!file) {
          console.error("No file selected");
          return;
        }

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", file);
        // Append the userId to the FormData
        formData.append("userId", localStorage.getItem("userId"));
        formData.append("accessToken", localStorage.getItem("access_token"));
        const response = await fetch(
          `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/data/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: formData,
          },
        );

        if (response.ok) {
          const responseData = await response.json();
          this.userProfil.avatar = responseData;
          this.userHistory.forEach((match) => {
            if (match.leftUser.id === this.userProfil.id) {
              match.leftUser.avatar = responseData;
            }
            if (match.rightUser.id === this.userProfil.id) {
              match.rightUser.avatar = responseData;
            }
          });
        } else {
          console.error("Failed to upload file:", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
  },
};
</script>

<style scoped>
.ms-row {
  display: flex;
}

.box {
  flex: 1;
  height: 4em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5em;
  display: flex;
  padding: auto 0;
  align-items: center;
  margin: 0.5em;
}

.box-left {
  flex: 3;
  align-items: center;
  padding: 1em;
}

.box-right {
  flex: 1;
  align-items: center;
  padding: 1em;
}

.centered {
  align-items: center;
  margin: 0 15%;
  color: rgb(217, 217, 229);
  margin-top: 4em;
}

.profile {
  width: auto;
  display: flex;
  margin-bottom: 1em;
}

.profile-data {
  margin-left: 1.5em;
  padding-top: 0.5em;
  flex: 6;
}

.two-fa-auth {
  flex: 1;
}

.message {
  color: #f63d14;
  padding-bottom: 1em;
}

.image-profile-container {
  max-width: 128px;
  position: relative;
  display: inline-block;
  flex: 1;
  width: fit-content;
}

.image-profile {
  width: 128px;
  height: 128px;
  overflow: hidden;
  display: block;
  position: relative;
}

.image-profile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
}

.image_history {
  width: 48px;
  height: 48px;
  overflow: hidden;
  display: inline-block;
  position: relative;
}

.table-wrapper {
  max-height: 55vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.score-table-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5em;
}

.image-table {
  width: 48px;
}

.name-table-left {
  flex: 1;
  text-align: left;
  padding: 0 1em;
}

.name-table-right {
  flex: 1;
  text-align: right;
  padding: 0 1em;
}

.score-table {
  display: flex;
  align-items: center;
  width: 4em;
}

.score-table-left {
  flex: 1;
  text-align: right;
}

.score-table-right {
  flex: 1;
  text-align: left;
}

.score-table-center {
  margin: 0 0.5em;
}

.image_history img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
}

.image_history + div {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
}

.image_history + div b {
  font-weight: bold;
}

.upload-icon {
  position: absolute;
  width: 30px;
  height: 30px;
  bottom: 0px;
  right: 0px;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}
.edit-icon {
  width: 1em;
  height: 1em;
  position: relative;
  object-fit: cover;
  transform: scale(1);
}

.text-color {
  color: rgb(217, 217, 229);
}
</style>
