import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../stores/authStore";

const UserAccount = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const fileInputRef = useRef();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user", user?._id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:4000/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      return res.json();
    },
    enabled: !!user?._id,
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:4000/user/avatar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Échec de l'envoi de l'avatar");
      
      const updated = await res.json();
useAuthStore.setState((state) => ({
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      avatar: updated.avatar,
    },
  },
}));
await refetch();

    } catch (err) {
      console.error("Erreur avatar:", err.message);
    }
  };

  useEffect(() => {
    if (user?._id) refetch();
  }, [user, refetch]);

  if (!user) return null;
  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement des informations.</p>;

  const profile = data?.profile || {};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Mon compte</h2>

      <div className="flex flex-col items-center gap-2 mb-6">
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {profile.avatar ? (
            <img
              src={`http://localhost:4000${profile.avatar}`}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-semibold uppercase">
              {(profile.firstName?.[0] || "U") + (profile.lastName?.[0] || "")}
            </div>
          )}
          <span className="absolute bottom-2 right-1 bg-primary text-white text-xs px-2 py-1 rounded-full shadow">+</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={data.email}
            disabled
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Nom d'utilisateur</label>
          <input
            type="text"
            value={profile.username || ""}
            disabled
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Prénom</label>
          <input
            type="text"
            value={profile.firstName || ""}
            disabled
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input
            type="text"
            value={profile.lastName || ""}
            disabled
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Téléphone</label>
          <input
            type="text"
            value={profile.phone || ""}
            disabled
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
