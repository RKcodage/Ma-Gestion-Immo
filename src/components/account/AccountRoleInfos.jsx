import { useMutation } from "@tanstack/react-query";
import { updateOwner } from "../../api/owner";
import { toast } from "react-toastify";
import useAuthStore from "../../stores/authStore";

const AccountRoleInfos = ({ form, setForm }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: (values) => updateOwner({ userId: user._id, values, token }),
    onSuccess: () => {
      toast.success("Informations enregistrées");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  // Affichage spécifique pour locataires (placeholder)
  if (user.role === "Locataire") {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Informations personnelles</h3>
        <p className="text-sm text-gray-600">Formulaire pour les locataires à venir.</p>
      </div>
    );
  }

  // Formulaire pour propriétaires
  return (
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
  );
};

export default AccountRoleInfos;
