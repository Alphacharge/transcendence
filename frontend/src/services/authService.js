export const checkLoggedIn = async () => {
  try {
    const response = await fetch(
      `https://${process.env.SERVER_IP}:${process.env.BACKEND_PORT}/auth/check`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json(); // Parse response JSON data
      console.log("response:", data);
      return data.isLoggedIn; // Return the isLoggedIn value from the response
    } else {
      return false; // Handle other response statuses if needed
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};
