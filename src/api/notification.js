// Create notification
export const createNotification = async (data, token) => {
  const res = await fetch(
    "https://site--ma-gestion-immo--574qbjcqcwyr.code.run/notifications",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error("Error while creating notification");

  return res.json();
};

// Fetch notifications for a user
export const fetchNotifications = async (token) => {
  const res = await fetch(
    "https://site--ma-gestion-immo--574qbjcqcwyr.code.run/notifications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Erreur while fetching notifications");
  }

  return res.json();
};

// Mark as notification as read
export const markNotificationAsRead = async (id, token) => {
  const res = await fetch(
    `https://site--ma-gestion-immo--574qbjcqcwyr.code.run/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Error while updating notifications");
  }

  return res.json();
};
