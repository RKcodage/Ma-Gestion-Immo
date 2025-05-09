// Get properties by owner
export const fetchPropertiesByOwner = async (ownerId, token) => {
  const res = await fetch(`http://localhost:4000/owner/${ownerId}/properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des propriétés");
  }

  return res.json();
};

// Create a new property
export const createProperty = async ({ ownerId, values, token }) => {
  const res = await fetch(`http://localhost:4000/property`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ownerId, ...values }),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la création de la propriété");
  }

  return res.json();
};

// Get property by Id
export const getPropertyById = async (propertyId, token) => {
  const res = await fetch(`http://localhost:4000/property/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement de la propriété");
  }

  return res.json();
};

// Update a property by ID
export const updateProperty = async ({ propertyId, values, token }) => {
  const res = await fetch(`http://localhost:4000/property/${propertyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour de la propriété");
  }

  return res.json();
};

// Delete a property by ID
export const deleteProperty = async ({ propertyId, token }) => {
  const res = await fetch(`http://localhost:4000/property/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la suppression de la propriété");
  }

  return res.json();
};
