// GET Owner by Id
export const fetchOwnerById = async (id, token) => {
  const res = await fetch(`http://localhost:4000/owner/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Impossible de récupérer les informations du propriétaire");
  }

  return res.json();
};

// Get owner by userId
export const fetchOwnerByUserId = async (userId, token) => {
  const res = await fetch(`http://localhost:4000/owner/by-user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok)
    throw new Error("Erreur lors de la récupération du propriétaire");
  return res.json();
};

// Update and put Owner infos
export const updateOwner = async ({ userId, values, token }) => {
  const res = await fetch("http://localhost:4000/owner/update", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, ...values }),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return res.json();
};
