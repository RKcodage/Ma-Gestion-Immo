import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../stores/authStore";
import useSidebarStore from "../../stores/sidebarStore";
import { fetchNotifications, markNotificationAsRead } from "../../api/notification";
import { fetchChatUnreadCount } from "../../api/chat"; 
import useClickOutside from "../../hooks/useClickOutside";
import NotificationIcon from "../icons/NotificationIcon";
import HomeIcon from "../icons/HomeIcon";
import ChatIcon from "../icons/ChatIcon";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const notifRef = useRef();
  useClickOutside(notifRef, () => setNotifOpen(false));

  // Notifications query
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(token),
    enabled: !!token,
  });

  // Unread messages query
  const { data: unreadChatCount = 0 } = useQuery({
    queryKey: ["chat-unread-count"],
    queryFn: () => fetchChatUnreadCount(token),
    enabled: !!token,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => markNotificationAsRead(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!user) return null;

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 bg-white border rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
          aria-label="Toggle sidebar"
        >
          <HomeIcon className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-primary">Ma Gestion Immo</h1>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Chat icon with unread badge */}
        <div className="relative">
          <button
            onClick={() => navigate("/dashboard/chat")}
            className="relative flex items-center justify-center"
          >
            <ChatIcon className="w-[1.1em] h-[1.1em] text-gray-800" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadChatCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications icon with badge */}
        <div className="relative flex items-center justify-center" ref={notifRef}>
          <button
            className="relative"
            onClick={() => setNotifOpen((prev) => !prev)}
          >
            <NotificationIcon className="w-[1.1em] h-[1.1em] text-gray-800" />
            {unreadCount > 0 && (
              <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-7 right-0 mt-2 w-72 bg-white border rounded shadow-lg text-sm max-h-80 overflow-auto z-50">
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm text-center">Aucune notification</p>
              ) : (
                <ul className="divide-y">
                  {notifications.slice(0, 5).map((notif) => (
                    <li
                      key={notif._id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        markAsReadMutation.mutate(notif._id);
                        setNotifOpen(false);
                        if (notif.link) navigate(notif.link);
                      }}
                    >
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {user?.profile?.avatar ? (
              <img
                src={user.profile.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold uppercase">
                {(user?.profile?.firstName?.[0] || "U") + (user?.profile?.lastName?.[0] || "")}
              </div>
            )}
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-sm">
              <Link
                to="/dashboard/account"
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                onClick={() => setOpen(false)}
              >
                Mon compte
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
