<template>
  <div>
      <table class="centered">
        <thead>
          <tr v-if="userProfil">
            <th colspan="2">
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
            </th>
            <th colspan="2">
              <p>{{ userProfil.username }}</p>
              <p>Registered since</p>
              <p>{{ userProfil.createdAt.slice(0, 10) }}</p>
            </th>
          </tr>
        </thead>
        <tbody v-if="userHistory">
          <tr v-for="match in userHistory" :key="match.id">
            <td>
              <div class="image_history">
                <img :src="getAvatarSrc(match.leftUser.avatar)" alt="Avatar" />
              </div>
            </td>
            <td>
              {{ match.leftUser.username }}
            </td>
            <td>
              {{ match.left_user_score }}
            </td>
            <td>
              <b>:</b>
            </td>
            <td>
              {{ match.right_user_score }}
            </td>
            <td>
              {{ match.rightUser.username }}
            </td>
            <td>
              <div class="image_history">
                <img :src="getAvatarSrc(match.rightUser.avatar)" alt="Avatar" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>

export default {
  data() {
    return {
      userProfil: null,
      userHistory: null,
    };
  },
  mounted() {
    // Make a call to your NestJS backend when the component is mounted
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

          // Handle the user history data as needed
        } else {
          console.error("Failed to fetch user history");
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    },
    getAvatarSrc(avatar) {
      // Adjust the path as needed based on your avatar structure
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/avatars/${avatar.id}${avatar.mime_type}`;
    },
    getUploadSrc() {
      return `https://${process.env.VUE_APP_BACKEND_IP}:8080/status/upload.png`;
    },
    openFileUpload() {
      // Trigger the click event of the file input when the image or upload icon is clicked
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
.image_history {
  width: 48px;
  height: 48px;
  overflow: hidden;
  display: inline-block;
  position: relative;
}

.image_history img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This property ensures the image fills the 32x32 container without distorting its aspect ratio */
  transform: scale(
    1
  ); /* Scale the image down to fit within the 32x32 container */
}

/* Center the user text */
.image_history + div {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px; /* Adjust the margin as needed */
}

/* Bold style for user text */
.image_history + div b {
  font-weight: bold;
}
.image-profile-container {
  position: relative;
  display: inline-block; /* Ensures the container only takes as much space as necessary */
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
  object-fit: cover; /* This property ensures the image fills the 32x32 container without distorting its aspect ratio */
  transform: scale(
    1
  ); /* Scale the image down to fit within the 32x32 container */
}
.upload-icon {
  position: absolute;
  width: 30px;
  height: 30px;
  bottom: 0px; /* Adjust this value to position the icon where you want it */
  right: 0px; /* Adjust this value to position the icon where you want it */
  padding: 5px;
  border-radius: 50%;
  cursor: pointer; /* Add a pointer cursor to indicate it's clickable */
}
</style>
