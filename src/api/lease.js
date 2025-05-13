const API_URL = import.meta.env.VITE_API_URL;

// Create lease
export const createLease = async (leaseData, token) => {
  const res = await fetch(`${API_URL}/lease`, {
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
  const res = await fetch(`${API_URL}/lease/${ownerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error to loading leases");
  }

  return res.json();
};

// Fetch leases by role
export const fetchLeasesByRole = async (token) => {
  const res = await fetch(`${API_URL}/leases`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur while fetching leases.");
  }

  return res.json();
};

// Update a lease
export const updateLease = async (leaseId, data, token) => {
  const response = await fetch(`${API_URL}/lease/${leaseId}`, {
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
  const response = await fetch(`${API_URL}/lease/${leaseId}`, {
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

// Fetch upcoming payments by lease
export const fetchUpcomingPayments = async (token) => {
  const res = await fetch(`${API_URL}/leases/upcoming-payments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error while fetching upcoming payments");
  }

  return res.json();
};

// Fetch payments historic by lease
export const fetchPaymentsHistoric = async (token) => {
  const response = await fetch(`${API_URL}/leases/historic`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error while fetching payments historic");
  }

  return response.json();
};
