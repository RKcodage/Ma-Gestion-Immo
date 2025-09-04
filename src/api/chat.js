const API_URL = import.meta.env.VITE_API_URL;

// Send message
export const sendMessage = async (token, messageData) => {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(messageData),
  });

  if (!res.ok) {
    throw new Error("Error while sending message");
  }

  return res.json();
};

// Fetch messages between users
export const fetchMessages = async (userId, token) => {
  const res = await fetch(`${API_URL}/messages/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error fetching messages");
  }

  return res.json();
};

// Fetch conversation from a user
export const fetchConversations = async (token) => {
  const res = await fetch(`${API_URL}/messages/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error fetching conversations");
  }

  return res.json();
};

// Fetch available recipients (tenants if owner, owner if tenant)
export const fetchRecipients = async (token) => {
  const res = await fetch(`${API_URL}/messages/recipients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des destinataires");
  }

  return res.json();
};

// Fetch unread messages count (for badge on Header Chat Icon)
export const fetchChatUnreadCount = async (token) => {
  const res = await fetch(`${API_URL}/messages/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des messages non lus");
  }

  const data = await res.json();
  return data.count;
};

// Mark message as read
export const markMessagesAsRead = async (userId, token) => {
  const res = await fetch(`${API_URL}/messages/read/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to mark messages as read");
  return res.json();
};
