export const fetchUserLanguage = async () => {
  try {
    const response = await fetch(
      `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/data/getlanguage`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.language;
    } else {
      return "en";
    }
  } catch (error) {
    throw new Error("Failed to save language preference");
  }
};
