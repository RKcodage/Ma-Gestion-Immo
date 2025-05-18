import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLease } from "@/api/lease";
import { toast } from "react-toastify";

export default function UpdateLeaseModal({ open, onClose, lease, token }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    rentAmount: "",
    chargesAmount: "",
    deposit: "",
    paymentDate: "",
  });

  useEffect(() => {
    if (lease) {
      setForm({
        startDate: lease.startDate?.slice(0, 10) || "",
        endDate: lease.endDate?.slice(0, 10) || "",
        rentAmount: lease.rentAmount || "",
        chargesAmount: lease.chargesAmount || "",
        deposit: lease.deposit || "",
        paymentDate: lease.paymentDate || "",
      });
    }
  }, [lease]);

  const mutation = useMutation({
    mutationFn: (data) => updateLease(lease._id, data, token),
    onSuccess: () => {
      toast.success("Bail mis à jour !");
      queryClient.invalidateQueries(["leases"]);
      onClose();
    },
    onError: () => toast.error("Erreur lors de la mise à jour."),
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
          <DialogTitle>Modifier le bail</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date de début</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date de fin</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loyer (€)</label>
            <input type="number" name="rentAmount" value={form.rentAmount} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Charges (€)</label>
            <input type="number" name="chargesAmount" value={form.chargesAmount} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dépôt de garantie (€)</label>
            <input type="number" name="deposit" value={form.deposit} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Jour de paiement (ex : 5)</label>
            <input type="number" name="paymentDate" value={form.paymentDate} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="text-sm text-gray-600 hover:underline">Annuler</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90">Sauvegarder</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
