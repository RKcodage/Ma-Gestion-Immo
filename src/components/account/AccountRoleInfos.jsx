import { useMutation } from "@tanstack/react-query";
import { updateOwner } from "../../api/owner";
import { updateTenant } from "../../api/tenant";
import { toast } from "react-toastify";
import useAuthStore from "../../stores/authStore";

const AccountRoleInfos = ({ form, setForm, initialForm = {} }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("visaleGuarantee.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        visaleGuarantee: {
          ...prev.visaleGuarantee,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const mutation = useMutation({
    mutationFn: (values) =>
      user.role === "Propriétaire"
        ? updateOwner({ userId: user._id, values, token })
        : updateTenant({ userId: user._id, values, token }),
    onSuccess: () => {
      toast.success("Informations enregistrées");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  // Detect modifications vs initial values
  const isOwner = user.role === "Propriétaire";
  const isModified = (() => {
    if (isOwner) {
      return (
        (form.companyName || "") !== (initialForm.companyName || "") ||
        (form.companyNumber || "") !== (initialForm.companyNumber || "") ||
        (form.companyPhone || "") !== (initialForm.companyPhone || "") ||
        (form.billingAddress || "") !== (initialForm.billingAddress || "") ||
        (form.status || "") !== (initialForm.status || "")
      );
    }
    // Tenant deep compare (including visaleGuarantee)
    const vg = form.visaleGuarantee || {};
    const vg0 = initialForm.visaleGuarantee || {};
    return (
      (form.address || "") !== (initialForm.address || "") ||
      (form.birthDate || "") !== (initialForm.birthDate || "") ||
      (form.employmentStatus || "") !== (initialForm.employmentStatus || "") ||
      Boolean(form.guarantor) !== Boolean(initialForm.guarantor) ||
      Boolean(vg.enabled) !== Boolean(vg0.enabled) ||
      (vg.contractNumber || "") !== (vg0.contractNumber || "") ||
      (vg.validityStart || "") !== (vg0.validityStart || "") ||
      (vg.validityEnd || "") !== (vg0.validityEnd || "")
    );
  })();

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h3 className="text-xl font-semibold mb-4">Informations personnelles</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {user.role === "Propriétaire" ? (
          <>
            <div>
              <label className="block text-sm font-medium">Nom de l'entreprise</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
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
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium">Adresse</label>
              <input
                type="text"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date de naissance</label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate?.slice(0, 10) || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Statut professionnel</label>
              <select
                name="employmentStatus"
                value={form.employmentStatus || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">-- Sélectionnez --</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Indépendant">Indépendant</option>
                <option value="Étudiant">Étudiant</option>
                <option value="Retraité">Retraité</option>
                <option value="Sans emploi">Sans emploi</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Garant</label>
              <select
                name="guarantor"
                value={form.guarantor ? "true" : "false"}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, guarantor: e.target.value === "true" }))
                }
                className="w-full px-4 py-2 pr-10 border rounded"
              >
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-2">Garantie Visale</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="visaleGuarantee.enabled"
                    checked={form.visaleGuarantee?.enabled || false}
                    onChange={handleChange}
                  />
                  Garantie activée
                </label>
                <input
                  type="text"
                  name="visaleGuarantee.contractNumber"
                  value={form.visaleGuarantee?.contractNumber || ""}
                  onChange={handleChange}
                  placeholder="Numéro du contrat"
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="date"
                  name="visaleGuarantee.validityStart"
                  value={form.visaleGuarantee?.validityStart?.slice(0, 10) || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="date"
                  name="visaleGuarantee.validityEnd"
                  value={form.visaleGuarantee?.validityEnd?.slice(0, 10) || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={!isModified || mutation.isPending || mutation.isLoading}
          aria-disabled={!isModified || mutation.isPending || mutation.isLoading}
          className={`px-6 py-2 rounded transition ${
            !isModified || mutation.isPending || mutation.isLoading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {mutation.isPending || mutation.isLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
};

export default AccountRoleInfos;
