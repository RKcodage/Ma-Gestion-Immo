const API_URL = import.meta.env.VITE_API_URL;

// GET Owner by Id
export const fetchOwnerById = async (id, token) => {
  const res = await fetch(`${API_URL}/owner/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error while fetching owner's informations");
  }

  return res.json();
};

// Get owner by userId
export const fetchOwnerByUserId = async (userId, token) => {
  const res = await fetch(`${API_URL}/owner/by-user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error while fetching owner");
  return res.json();
};

// Update and put Owner infos
export const updateOwner = async ({ userId, values, token }) => {
  const res = await fetch(`${API_URL}/owner/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, ...values }),
  });
  if (!res.ok) throw new Error("Error while updating owner");
  return res.json();
};
