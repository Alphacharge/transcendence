// authService.js

const checkLoggedIn = async () => {
  try {
    const response = await fetch(`https://${process.env.VUE_APP_BACKEND_IP}:3000/auth/check`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("userData")}`, // Get token from localStorage
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData; // or return some indication of successful login
    } else {
      return null; // or handle the error accordingly
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    return null; // or handle the error accordingly
  }
};

export { checkLoggedIn };
