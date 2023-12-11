<template>
  <div class="centered">
      <div>
        <div class="profile" v-if="userProfil">
            <div class="image-profile-container">
              <div class="image-profile">
                <img :src="getAvatarSrc(userProfil.avatar)" alt="Avatar" />
              </div>
              <div class="upload-icon" @click="openFileUpload">
                <img class="upload-icon" :src="getUploadSrc()" alt="Upload" />
                <input
                  type="file"
                  ref="fileInput"
                  style="display: none"
                  @change="uploadFile"
                />
              </div>
            </div>
          <div class="profile-data">
            <div v-if="showMessage" class="message">
            {{ messageText }}
            </div>
            <p v-if="!isEditing" @click="startEditing" class="text-color">{{ userProfil.username }}</p>
          <input v-if="isEditing" v-model="editedUsername" @keyup.enter="saveUsername" @blur="saveUsername" />
            <p class="text-color">{{ $t("profileRegister") }}</p>
            <p class="text-color">{{ userProfil.createdAt.slice(0, 10) }}</p>
          </div>
        </div>
      </div>
      <div v-if="userHistory">
        <div class="ms-row"><div class="box">
          <div class="box-left">{{ $t("profileWins") }}:</div>
          <div class="box-right">{{ userMilestones.wins }}</div>
        </div><div class="box">
          <div class="box-left">{{ $t("profileLos") }}:</div>
          <div class="box-right">{{ userMilestones.losses }}</div>
        </div></div>
        <div class="ms-row"><div class="box">
          <div class="box-left">{{ $t("profileMatches") }}:</div>
          <div class="box-right">{{ userMilestones.matches }}</div>
        </div><div class="box">
          <div class="box-left">{{ $t("profileTournament") }}:</div>
          <div class="box-right">{{ userMilestones.tourmatches }}</div>
        </div></div>
        <div class="ms-row"><div class="box">
          <div class="box-left">{{ $t("profileContacts") }}:</div>
          <div class="box-right">{{ userMilestones.contacts[0].total_contacts }}</div>
        </div><div class="box">
          <div class="box-left">{{ $t("profileTourWins") }}:</div>
          <div class="box-right">{{ userMilestones.tourwins }}</div>
        </div></div>
        <div class="score-table-line" v-for="match in userHistory" :key="match.id">
          <div class="image-table">
            <div class="image_history">
              <img :src="getAvatarSrc(match.leftUser.avatar)" alt="Avatar" />
            </div>
          </div>
          <div class="name-table-left">
            {{ match.leftUser.username }}
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
            {{ match.rightUser.username }}
          </div>
          <div class="image-table">
            <div class="image_history">
              <img :src="getAvatarSrc(match.rightUser.avatar)" alt="Avatar" />
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userProfil: null,
      isEditing: false,
      editedUsername: '',
      messageText: '',
      showMessage: false,
      userHistory: null,
      userMilestones: null,
    };
  },
  mounted() {
    this.fetchUserHistory();
  },
  methods: {
    async fetchUserHistory() {
      try {
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/userstats`,
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
      // Initialize the editedUsername with the current username
      this.editedUsername = this.userProfil.username;
      // Set the isEditing flag to true
      this.isEditing = true;
    },
    async saveUsername() {
      try{

      // Send a request to your backend to add friends
      const response = await fetch(`https://${process.env.VUE_APP_BACKEND_IP}:3000/data/editname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          newUsername: this.editedUsername,
        }),
      });
          if (response.ok) {
            const responseData = await response.json();
            if (responseData.userName){
              this.userProfil.username=this.editedUsername;
              this.isEditing = false;
              this.showMessage = false;
            } else {
              this.showMessage = true;
              this.messageText = "Username is taken";
              setTimeout(() => {
                this.showMessage = false;
              }, 2000);
            }
          } else {
            console.error("Failed to edit username");
          }
        } catch(error) {
          console.error("Error edit username:", error);
        }
    },
    getAvatarSrc(avatar) {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/avatars/${avatar.id}${avatar.mime_type}`;
    },
    getUploadSrc() {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/status/upload.png`;
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

        // Make a POST request to your backend
        const response = await fetch(
          `https://${process.env.VUE_APP_BACKEND_IP}:3000/data/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        console.log(response);
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

          console.log("File uploaded successfully:", responseData);
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

<style>
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
  margin-bottom: 1em;;
}

.profile-data {
  margin-left: 5em;
  padding-top: 0.5em;
}

.message {
  color: #f63d14;
  padding-bottom: 1em;
}

.image-profile-container {
  position: relative;
  display: inline-block;
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
  transform: scale(
    1
  );
}

.image_history {
  width: 48px;
  height: 48px;
  overflow: hidden;
  display: inline-block;
  position: relative;
}

.score-table-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5em;
}

.image-table{
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
  transform: scale(
    1
  );
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

.text-color {
  color: rgb(217, 217, 229);
}
</style>
