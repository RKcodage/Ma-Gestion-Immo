import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAuthStore from "../stores/authStore";
import { fetchOwnerByUserId, updateOwner } from "../api/owner";
import { toast } from "react-toastify";
import AccountUserInfos from "../components/account/AccountUserInfos";

const UserAccount = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const fileInputRef = useRef();
  const [avatarError, setAvatarError] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    companyNumber: "",
    companyPhone: "",
    billingAddress: "",
    status: "",
  });

  // Get user infos
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

  // Get owner infos by userId
  const { data: ownerData } = useQuery({
    queryKey: ["owner", user._id],
    queryFn: () => fetchOwnerByUserId(user._id, token),
    enabled: !!user._id && !!token,
  });

  // Set form with data 
  useEffect(() => {
    if (ownerData) {
      setForm({
        companyName: ownerData.companyName || "",
        companyNumber: ownerData.companyNumber || "",
        companyPhone: ownerData.companyPhone || "",
        billingAddress: ownerData.billingAddress || "",
        status: ownerData.status || "",
      });
    }
  }, [ownerData]);

  const mutation = useMutation({
    mutationFn: (values) => updateOwner({ userId: user._id, values, token }),
    onSuccess: () => {
      toast.success("Informations enregistrées");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  // Upload avatar
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
      setAvatarError(false);
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Mon compte</h2>

      <AccountUserInfos
          email={data?.email}
          avatarError={avatarError}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
      

      {/* Card Informations professionnelles */}
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Informations personnelles</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Nom de l'entreprise</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Ex : SCI Les Lilas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Numéro SIRET</label>
            <input
              type="text"
              name="companyNumber"
              value={form.companyNumber || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="Ex : 123 456 789 00012"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Téléphone pro</label>
            <input
              type="text"
              name="companyPhone"
              value={form.companyPhone || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Adresse de facturation</label>
            <input
              type="text"
              name="billingAddress"
              value={form.billingAddress || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Statut</label>
            <select
              name="status"
              value={form.status || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">-- Sélectionnez --</option>
              <option value="Particulier">Particulier</option>
              <option value="Professionnel">Professionnel</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAccount;
