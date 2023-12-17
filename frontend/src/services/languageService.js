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
      console.log("fetched language from backend:", data.language);
      return data.language;
    } else {
      return "en";
    }
  } catch (error) {
    throw new Error("Failed to save language preference");
  }
};

export function selectLanguage(language) {
  // Set the corresponding locale based on the current language
  console.log("input language:", language);
  switch (language.toLowerCase()) {
    case "en":
      language = "en";
      break;
    case "de":
      language = "de";
      break;
    case "it":
      language = "it";
      break;
    default:
      language = "en";
      break;
  }
  console.log("parsed language:", language);
  localStorage.setItem("userLanguage", language);
  return language;
}
