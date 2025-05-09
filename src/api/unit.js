// Create Unit
export const createUnit = async (values, token) => {
  const res = await fetch("http://localhost:4000/unit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la création de l’unité");
  }

  return res.json();
};

// Get units with lease count
export const getUnitsWithLeaseCount = async (propertyId, token) => {
  const res = await fetch(
    `http://localhost:4000/property/${propertyId}/units`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des unités");
  }

  return res.json();
};

// Update unit
export const updateUnit = async ({ unitId, values, token }) => {
  const res = await fetch(`http://localhost:4000/unit/${unitId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour de l’unité");
  }

  return res.json();
};

// Delete unit
export const deleteUnit = async (unitId, token) => {
  const res = await fetch(`http://localhost:4000/unit/${unitId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la suppression de l'unité");
  }

  return res.json();
};
