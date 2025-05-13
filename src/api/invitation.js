const API_URL = import.meta.env.VITE_API_URL;

// Fetch invitation infos by token
export const fetchInvitationByToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/invitation/${token}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error while fetching invitation");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};
