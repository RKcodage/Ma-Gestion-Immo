import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLease } from "@/api/lease";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";

const CreateLeaseModal = ({ open, onClose, propertyId, units, ownerId, token }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    unitId: "",
    tenantEmail: "",
    startDate: "",
    endDate: "",
    rentAmount: "",
    chargesAmount: "",
    deposit: "",
    paymentDate: "",
  });

  const mutation = useMutation({
    mutationFn: (data) => createLease({ ...data, ownerId }, token),
    onSuccess: () => {
      toast.success("Bail créé !");
      queryClient.invalidateQueries(["leases", ownerId]);
      queryClient.invalidateQueries(["units", propertyId]);
      onClose();
    },
    onError: () => toast.error("Erreur lors de la création du bail."),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un bail</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <select name="unitId" required value={form.unitId} onChange={handleChange} className="w-full px-4 py-2 border rounded">
            <option value="">-- Sélectionnez une unité --</option>
            {units.map((unit) => (
              <option key={unit._id} value={unit._id}>{unit.label}</option>
            ))}
          </select>

          <input type="email" name="tenantEmail" placeholder="Email du locataire" value={form.tenantEmail} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />

          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

          <input type="number" name="rentAmount" placeholder="Loyer (€)" value={form.rentAmount} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="number" name="chargesAmount" placeholder="Charges (€)" value={form.chargesAmount} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input type="number" name="deposit" placeholder="Dépôt de garantie (€)" value={form.deposit} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          <input type="number" name="paymentDate" placeholder="Jour de paiement (ex : 5)" value={form.paymentDate} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="text-sm text-gray-600 hover:underline">Annuler</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90">Créer</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeaseModal;
