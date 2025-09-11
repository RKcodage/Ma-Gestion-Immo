import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { uploadLeaseDocument } from "@/api/document";
import useAuthStore from "@/stores/authStore";

const AddDocumentModal = ({ open, onClose, leases = [], units = [], properties = [] }) => {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    type: "",
    leaseId: "",
    unitId: "",
    propertyId: "",
    file: null,
    isPrivate: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "propertyId") {
      // Reset dependent fields when changing property
      setForm((prev) => ({
        ...prev,
        propertyId: value,
        unitId: "",
        leaseId: "",
      }));
    } else if (name === "unitId") {
      // On unit change, if exactly one lease matches preselect it, else force explicit choice
      const matching = leases.filter((l) => l.unitId?._id === value);
      setForm((prev) => ({
        ...prev,
        unitId: value,
        leaseId: matching.length === 1 ? matching[0]._id : "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
      }));
    }
  };
  

  const mutation = useMutation({
    mutationFn: () => uploadLeaseDocument(form, token),
    onSuccess: () => {
      toast.success("Document ajouté !");
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["notifications"]);
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du document");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.file || !form.name || !form.type) {
      return toast.error("Tous les champs obligatoires doivent être remplis");
    }

    // Owner validations
    if (role === "Propriétaire") {
      if (!form.unitId) {
        return toast.error("Sélectionnez une unité concernée");
      }
      const unitLeases = leases.filter((l) => l.unitId?._id === form.unitId);
      if (unitLeases.length > 1 && !form.leaseId) {
        return toast.error("Sélectionnez le bail concerné");
      }
    }

    // Tenant : lease required
    if (role === "Locataire" && !form.leaseId) {
      return toast.error("Sélectionnez le bail concerné");
    }

    mutation.mutate();
  };

  // Filtered units by property selected
  const filteredUnits = form.propertyId
    ? units.filter((u) => u.propertyId?._id === form.propertyId)
    : units;

  // Leases linked to the selected unit (Owner view).
  // If more than one lease exists, show a "Lease" select (Unit — Tenants)
  const unitLeasesForOwner = form.unitId
    ? leases.filter((l) => l.unitId?._id === form.unitId)
    : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            name="name"
            placeholder="Nom du document"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">-- Type de document --</option>
            <option value="Contrat">Contrat</option>
            <option value="Récépissé">Récépissé</option>
            <option value="Diagnostic">Diagnostic</option>
            <option value="Justificatif de domicile">Justificatif de domicile</option>
            <option value="Fiche de paie">Fiche de paie</option>
            <option value="Avis d'imposition">Avis d'imposition</option>
          </select>

          {role === "Propriétaire" && (
            <>
              <select
                name="propertyId"
                value={form.propertyId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">-- Sélectionnez une propriété --</option>
                {properties.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.address} ({p.city})
                  </option>
                ))}
              </select>

              <select
                name="unitId"
                value={form.unitId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">-- Sélectionnez une unité --</option>
                {filteredUnits.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.label}
                  </option>
                ))}
              </select>

              {/* Lease select shown if multiple leases exist for the selected unit */}
              {form.unitId && unitLeasesForOwner.length > 1 && (
                <select
                  name="leaseId"
                  value={form.leaseId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">-- Sélectionnez le bail --</option>
                  {unitLeasesForOwner.map((l) => {
                    const tenants = Array.isArray(l.tenants) ? l.tenants : [];
                    const names = tenants
                      .map((t) => `${t?.userId?.profile?.firstName ?? ""} ${t?.userId?.profile?.lastName ?? ""}`.trim())
                      .filter(Boolean)
                      .join(", ");
                    return (
                      <option key={l._id} value={l._id}>
                        {l.unitId?.label || "Unité"} — {names || "Sans locataire"}
                      </option>
                    );
                  })}
                </select>
              )}
            </>
          )}

          {role === "Locataire" && (
            <select
              name="leaseId"
              value={form.leaseId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">-- Sélectionnez votre bail --</option>
              {leases.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.unitId?.label} - {l.unitId?.propertyId?.address}
                </option>
              ))}
            </select>
          )}

          <input
            type="file"
            accept=".pdf,image/*"
            name="file"
            onChange={handleChange}
            required
            className="w-full"
          />

          {role === "Propriétaire" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={form.isPrivate}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label htmlFor="isPrivate" className="text-sm">
                Document privé (visible uniquement par vous)
              </label>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="text-sm text-gray-600 hover:underline">
              Annuler
            </button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90">
              Ajouter
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentModal;
