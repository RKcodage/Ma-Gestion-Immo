// GET tenant by userId
export const fetchTenantByUserId = async (userId, token) => {
  const res = await fetch(
    `https://site--ma-gestion-immo--574qbjcqcwyr.code.run/tenant/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Unable to fetch tenant data");
  }

  return res.json();
};

// PUT tenant by userId
export const updateTenant = async ({ userId, values, token }) => {
  const res = await fetch(
    `https://site--ma-gestion-immo--574qbjcqcwyr.code.run/tenant/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    },
  );

  if (!res.ok) {
    throw new Error("Unable to update tenant data");
  }

  return res.json();
};
