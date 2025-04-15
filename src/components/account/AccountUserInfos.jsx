import useAuthStore from "../../stores/authStore";

const AccountUserInfos = ({ email, avatarError, fileInputRef, handleFileChange }) => {
  const user = useAuthStore((state) => state.user);
  const profile = user?.profile || {};

  const initials = (
    ((profile.firstName?.[0] || "") + (profile.lastName?.[0] || "")).toUpperCase() || "?"
  );
  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  const hasValidAvatar =
    profile.avatar && typeof profile.avatar === "string" && !avatarError;

  return (
    <>
      <div className="flex flex-col items-center gap-2 mb-6">
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {hasValidAvatar ? (
            <img
              src={`http://localhost:4000${profile.avatar}`}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border"
              onError={() => avatarError(true)}
            />
          ) : (
            <div
              title={fullName}
              className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-semibold uppercase"
            >
              {initials}
            </div>
          )}
          <span className="absolute bottom-2 right-1 bg-primary text-white text-xs px-2 py-1 rounded-full shadow">
            +
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
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
    </>
  );
};

export default AccountUserInfos;
