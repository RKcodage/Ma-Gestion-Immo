// Create lease
export const createLease = async (leaseData, token) => {
  const res = await fetch("http://localhost:4000/lease", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(leaseData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Lease not created");
  }

  return res.json();
};

// Get leases from an owner
export const fetchLeasesByOwner = async (ownerId, token) => {
  const res = await fetch(`http://localhost:4000/lease/${ownerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error to loading leases");
  }

  return res.json();
};

// Update a lease
export const updateLease = async (leaseId, data, token) => {
  const response = await fetch(`http://localhost:4000/lease/${leaseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Update error");
  }

  return response.json();
};

// Delete a lease
export const deleteLease = async (leaseId, token) => {
  const response = await fetch(`/lease/${leaseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error during lease deleting");
  }

  return response.json();
};
