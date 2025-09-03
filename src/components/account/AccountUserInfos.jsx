import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { updateUser, deleteUserAvatar, deleteUserAccount } from "../../api/user";
import ConfirmModal from "../modals/ConfirmModal";
import PasswordUpdateModal from "../modals/PasswordUpdateModal";

const AccountUserInfos = ({ avatarError, fileInputRef, handleFileChange }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user?.email || "",
    username: user?.profile?.username || "",
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    phone: user?.profile?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!user) return null;

  const initials = (
    ((form.firstName?.[0] || "") + (form.lastName?.[0] || "")).toUpperCase() || "?"
  );
  const fullName = `${form.firstName || ""} ${form.lastName || ""}`.trim();

  const hasValidAvatar =
    user?.profile?.avatar && typeof user.profile.avatar === "string" && !avatarError;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: deleteAvatar } = useMutation({
    mutationFn: () => deleteUserAvatar(token),
    onSuccess: () => {
      toast.success("Avatar supprimé !");
      setUser({
        ...user,
        profile: {
          ...user.profile,
          avatar: "",
        },
      });
    },
    onError: () => toast.error("Erreur lors de la suppression de l'avatar"),
  });

  const mutation = useMutation({
    mutationFn: (values) => updateUser({ id: user._id, values, token }),
    onSuccess: () => {
      toast.success("Profil mis à jour avec succès !");
      setUser({
        ...user,
        email: form.email,
        profile: {
          ...user.profile,
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.username,
          phone: form.phone,
        },
      });
    },
    onError: () => toast.error("Erreur lors de la mise à jour du profil"),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteUserAccount(user._id, token),
    onSuccess: () => {
      toast.success("Compte supprimé. À bientôt !");
      logout();
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Impossible de supprimer le compte.");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (values) => updateUser({ id: user._id, values, token }),
    onSuccess: () => {
      toast.success("Mot de passe mis à jour !");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordModal(false);
    },
    onError: () => toast.error("Erreur lors du changement de mot de passe"),
  });

  const handlePasswordUpdate = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas.");
    }

    passwordMutation.mutate({
      oldPassword: passwordForm.oldPassword,
      password: passwordForm.newPassword,
    });
  };

  // To set if form values are changed 
  const isModified =
  form.email !== (user?.email || "") ||
  form.username !== (user?.profile?.username || "") ||
  form.firstName !== (user?.profile?.firstName || "") ||
  form.lastName !== (user?.profile?.lastName || "") ||
  form.phone !== (user?.profile?.phone || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      email: form.email,
      profile: {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        phone: form.phone,
      },
    };

    mutation.mutate(values);
  };

  const confirmDelete = () => {
    deleteAccountMutation.mutate();
  };
  
  return (
    <>
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 mb-6 relative">
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
              src={user.profile.avatar}
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

          {/* + button */}
          <span className="absolute bottom-2 right-1 bg-primary text-white text-xs px-2 py-1 rounded-full shadow">
            +
          </span>

          {/* - button */}
          {hasValidAvatar && (
            <button
              type="button"
              onClick={() => deleteAvatar()}
              className="absolute bottom-2 left-1 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs shadow"
              title="Supprimer l'avatar"
            >
              –
            </button>
          )}
        </label>
      </div>


      {/* Form user infos */}
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Prénom</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Téléphone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="sm:col-span-2 flex justify-between items-center mt-4 gap-4 flex-wrap">
          <button
            type="submit"
            disabled={!isModified || mutation.isPending || mutation.isLoading}
            aria-disabled={!isModified || mutation.isPending || mutation.isLoading}
            className={`px-6 py-2 rounded transition
              ${!isModified || mutation.isPending || mutation.isLoading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"}
            `}
          >
            {mutation.isPending || mutation.isLoading ? "Enregistrement..." : "Enregistrer les modifications"}          
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="text-sm text-primary hover:underline"
            >
              Modifier mon mot de passe
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-sm text-red-600 hover:underline"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </form>

      {showModal && (
        <ConfirmModal
          title="Suppression du compte"
          message="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?"
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}

      {showPasswordModal && (
        <PasswordUpdateModal
          onClose={() => setShowPasswordModal(false)}
          onConfirm={handlePasswordUpdate}
          form={passwordForm}
          setForm={setPasswordForm}
          handleChange={(e) => {
            const { name, value } = e.target;
            setPasswordForm((prev) => ({ ...prev, [name]: value }));
          }}
        />
      )}
    </>
  );
};

export default AccountUserInfos;
