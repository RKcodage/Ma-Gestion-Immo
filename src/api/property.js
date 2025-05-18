const API_URL = import.meta.env.VITE_API_URL;

// Get properties by owner
export const fetchPropertiesByOwner = async (ownerId, token) => {
  const res = await fetch(`${API_URL}/owner/${ownerId}/properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error while loading properties");
  }

  return res.json();
};

// Create a new property
export const createProperty = async ({ ownerId, values, token }) => {
  const res = await fetch(`${API_URL}/property`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ownerId, ...values }),
  });

  if (!res.ok) {
    throw new Error("Error while creating property");
  }

  return res.json();
};

// Get property by Id
export const getPropertyById = async (propertyId, token) => {
  const res = await fetch(`${API_URL}/property/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error while fetching property");
  }

  return res.json();
};

// Update a property by ID
export const updateProperty = async ({ propertyId, values, token }) => {
  const res = await fetch(`${API_URL}/property/${propertyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Error while updating property");
  }

  return res.json();
};

// Delete a property by ID
export const deleteProperty = async ({ propertyId, token }) => {
  const res = await fetch(`${API_URL}/property/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error while deleting property");
  }

  return res.json();
};
