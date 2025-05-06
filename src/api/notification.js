// Create notification
export const createNotification = async (data, token) => {
  const res = await fetch("http://localhost:4000/notifications", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erreur lors de la création de la notification");

  return res.json();
};

// Fetch notifications for a user
export const fetchNotifications = async (token) => {
  const res = await fetch("http://localhost:4000/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des notifications");
  }

  return res.json();
};

// Mark as notification as read
export const markNotificationAsRead = async (id, token) => {
  const res = await fetch(`http://localhost:4000/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour de la notification");
  }

  return res.json();
};
