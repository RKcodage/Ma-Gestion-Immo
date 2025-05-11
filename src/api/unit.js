// Create Unit
export const createUnit = async (values, token) => {
  const res = await fetch(
    "https://site--ma-gestion-immo--574qbjcqcwyr.code.run/unit",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    },
  );

  if (!res.ok) {
    throw new Error("Error while creating unit");
  }

  return res.json();
};

// Get units with lease count
export const getUnitsWithLeaseCount = async (propertyId, token) => {
  const res = await fetch(
    `https://site--ma-gestion-immo--574qbjcqcwyr.code.run/property/${propertyId}/units`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Error while fetching units");
  }

  return res.json();
};

// Update unit
export const updateUnit = async ({ unitId, values, token }) => {
  const res = await fetch(
    `https://site--ma-gestion-immo--574qbjcqcwyr.code.run/unit/${unitId}`,
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
    throw new Error("Error while updating unit");
  }

  return res.json();
};

// Delete unit
export const deleteUnit = async (unitId, token) => {
  const res = await fetch(
    `https://site--ma-gestion-immo--574qbjcqcwyr.code.run/unit/${unitId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Error while deleting unit");
  }

  return res.json();
};
