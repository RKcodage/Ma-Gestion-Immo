const API_URL = import.meta.env.VITE_API_URL;

// Fetch documents from a lease
export const fetchLeaseDocuments = async (token, filters = {}) => {
  const params = new URLSearchParams();

  if (filters.unitId) params.append("unitId", filters.unitId);
  if (filters.propertyId) params.append("propertyId", filters.propertyId);

  const res = await fetch(`${API_URL}/documents?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error while fetching documents");
  }

  return res.json();
};

// Upload document
export const uploadLeaseDocument = async (form, token) => {
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("type", form.type);
  if (form.leaseId) formData.append("leaseId", form.leaseId);
  if (form.unitId) formData.append("unitId", form.unitId);
  formData.append("file", form.file);
  formData.append("isPrivate", form.isPrivate);

  const res = await fetch(`${API_URL}/document`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Error while sending document");
  }

  return res.json();
};

// Download documents
export const downloadLeaseDocument = async (doc, token) => {
  const res = await fetch(`${API_URL}/documents/${doc._id}/download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Downloading error");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = doc.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Delete document
export const deleteLeaseDocument = async (docId, token) => {
  const res = await fetch(`${API_URL}/document/${docId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorDetails = await res.json().catch(() => ({}));
    throw new Error(errorDetails?.error || "Error while deleting document");
  }

  return res.json();
};
