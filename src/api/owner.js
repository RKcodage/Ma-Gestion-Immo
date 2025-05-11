// GET Owner by Id
export const fetchOwnerById = async (id, token) => {
  const res = await fetch(
    `https://site--ma-gestion-immo--574qbjcqcwyr.code.run/owner/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Error while fetching owner's informations");
  }

  return res.json();
};

// Get owner by userId
export const fetchOwnerByUserId = async (userId, token) => {
  const res = await fetch(
    `https://site--ma-gestion-immo--574qbjcqcwyr.code.run/owner/by-user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Error while fetching owner");
  return res.json();
};

// Update and put Owner infos
export const updateOwner = async ({ userId, values, token }) => {
  const res = await fetch(
    "https://site--ma-gestion-immo--574qbjcqcwyr.code.run/owner/update",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, ...values }),
    },
  );
  if (!res.ok) throw new Error("Error while updating owner");
  return res.json();
};
