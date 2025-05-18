import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit } from "@/api/unit";
import { toast } from "react-toastify";

const AddUnitModal = ({ open, onClose, propertyId, token }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    label: "",
    type: "",
    floor: "",
    surface: "",
    rentAmount: "",
    chargesAmount: "",
    description: "",
  });

  const mutation = useMutation({
    mutationFn: (data) => createUnit({ ...data, propertyId }, token),
    onSuccess: () => {
      toast.success("Unité ajoutée !");
      queryClient.invalidateQueries(["units", propertyId]);
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la création de l’unité.");
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une unité</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="label"
            placeholder="Nom de l’unité (ex : Appartement A)"
            value={form.label}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">-- Type d’unité --</option>
            <option value="Appartement">Appartement</option>
            <option value="Parking">Parking</option>
            <option value="Boxe">Boxe</option>
            <option value="Local commercial">Local commercial</option>
            <option value="Autre">Autre</option>
          </select>
          <input
            type="text"
            name="floor"
            placeholder="Étage"
            value={form.floor}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="surface"
            placeholder="Surface (m²)"
            value={form.surface}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="rentAmount"
            placeholder="Loyer (€)"
            value={form.rentAmount}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="chargesAmount"
            placeholder="Charges (€)"
            value={form.chargesAmount}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            rows={3}
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-600 hover:underline"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
            >
              Ajouter
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUnitModal;
