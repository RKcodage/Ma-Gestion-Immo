const API_URL = import.meta.env.VITE_API_URL;

// Get user by id
export const fetchUserById = async (id, token) => {
  const res = await fetch(`${API_URL}/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error while fetching user");
  }

  return res.json();
};

// Upload user avatar
export const uploadAvatar = async ({ file, token }) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${API_URL}/user/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Avatar sending error");
  }

  return res.json();
};

// Delete user avatar
export const deleteUserAvatar = async (token) => {
  const response = await fetch(`${API_URL}/user/avatar`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "Failed to delete avatar");
  }

  return response.json();
};

// Update user infos
export const updateUser = async ({ id, values, token }) => {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) throw new Error("Error while updating user");
  return res.json();
};

export const deleteUserAccount = async (userId, token) => {
  const response = await fetch(`${API_URL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "Failed to delete account");
  }

  return response.json();
};
