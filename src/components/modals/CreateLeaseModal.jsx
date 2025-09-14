import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLease } from "@/api/lease";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";
import useSubmitLockStore from "@/stores/submitLockStore";

const CreateLeaseModal = ({ open, onClose, units = [], properties = [], ownerId, token }) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    propertyId: "",
    unitId: "",
    tenantEmails: [""],
    startDate: "",
    endDate: "",
    rentAmount: "",
    chargesAmount: "",
    deposit: "",
    paymentDate: "",
  });

  const isLocked = useSubmitLockStore((s) => s.isLocked);
  const withLock = useSubmitLockStore((s) => s.withLock);

  const mutation = useMutation({
    mutationFn: (data) => createLease({ ...data, ownerId }, token),
    onSuccess: () => {
      toast.success("Bail créé !");
      queryClient.invalidateQueries({ queryKey: ["leases"], exact: false });
      onClose();
    },
    onError: () => toast.error("Erreur lors de la création du bail."),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "propertyId") {
      // Reset unit when property changes
      setForm((prev) => ({ ...prev, propertyId: value, unitId: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI guard: only owners can create a lease
    if (user?.role !== "Propriétaire") {
      toast.error("Action non autorisée");
      return;
    }
    if (isLocked("create-lease") || mutation.isLoading) return;
    withLock(
      "create-lease",
      () =>
        new Promise((resolve) =>
          mutation.mutate(form, {
            onSettled: resolve,
          })
        ),
      200
    );
  };

  // Filter units by selected property (when provided)
  const filteredUnits = form.propertyId
    ? units.filter((u) => u?.propertyId?._id === form.propertyId)
    : units;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un bail</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {properties.length > 0 && (
            <select
              name="propertyId"
              required
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
          )}
          <select name="unitId" required value={form.unitId} onChange={handleChange} className="w-full px-4 py-2 border rounded">
            <option value="">-- Sélectionnez une unité --</option>
            {filteredUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>{unit.label}</option>
            ))}
          </select>

          <div className="space-y-2">
  <label className="text-sm font-medium">Emails des locataires</label>

  {form.tenantEmails.map((email, index) => (
    <div key={index} className="flex items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => {
          const updated = [...form.tenantEmails];
          updated[index] = e.target.value;
          setForm((prev) => ({ ...prev, tenantEmails: updated }));
        }}
        required
        placeholder={`Locataire ${index + 1}`}
        className="flex-1 px-4 py-2 border rounded"
      />

      {form.tenantEmails.length > 1 && (
        <button
          type="button"
          onClick={() => {
            const updated = form.tenantEmails.filter((_, i) => i !== index);
            setForm((prev) => ({ ...prev, tenantEmails: updated }));
          }}
          className="text-red-500 hover:text-red-700"
        >
          ❌
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setForm((prev) => ({
        ...prev,
        tenantEmails: [...prev.tenantEmails, ""],
      }))
    }
    className="text-blue-500 hover:underline text-sm"
  >
    ➕ Ajouter un locataire
  </button>
</div>


          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

          <input type="number" name="rentAmount" placeholder="Loyer (€)" value={form.rentAmount} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="number" name="chargesAmount" placeholder="Charges (€)" value={form.chargesAmount} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="number" name="deposit" placeholder="Dépôt de garantie (€)" value={form.deposit} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          <input type="number" name="paymentDate" placeholder="Jour de paiement (ex : 5)" value={form.paymentDate} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="text-sm text-gray-600 hover:underline">Annuler</button>
            <button
              type="submit"
              disabled={isLocked("create-lease") || mutation.isLoading}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 disabled:opacity-60"
            >
              {isLocked("create-lease") || mutation.isLoading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeaseModal;
