const API_URL = import.meta.env.VITE_API_URL;

// Fetch invitation infos by token
export const fetchInvitationByToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/invitation/${token}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error while fetching invitation");
    }

    return data;
  } catch (err) {
    throw err;
  }
};
