// authService.js

const checkLoggedIn = async () => {
  try {
    const response = await fetch(
      `https://${process.env.VUE_APP_BACKEND_IP}:3000/auth/check`,
      {
        method: "GET",
        headers: {
          // this is the authorization header format
          // Authorization: Bearer <token>
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Get token from localStorage
        },
      },
    );

    if (response.ok && response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};

export { checkLoggedIn };
