import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProperty } from "../../api/property";
import useAuthStore from "../../stores/authStore";
import { toast } from "react-toastify";
import useSubmitLockStore from "@/stores/submitLockStore";

const AddPropertyModal = ({ open, onClose, ownerId }) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    description: "",
    type: "",
    surface: "",
    rooms: "",
    rent: "",
    charges: "",
    isOccupied: false,
  });

  const isLocked = useSubmitLockStore((s) => s.isLocked);
  const withLock = useSubmitLockStore((s) => s.withLock);

  const mutation = useMutation({
    mutationFn: (data) => createProperty({ ownerId, values: data, token }),
    onSuccess: () => {
      toast.success("Propriété ajoutée !");
      queryClient.invalidateQueries(["properties", ownerId]);
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la propriété");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked("add-property") || mutation.isLoading) return;
    withLock(
      "add-property",
      () =>
        new Promise((resolve) =>
          mutation.mutate(form, {
            onSettled: resolve,
          })
        ),
      200
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une propriété</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="address"
            placeholder="Adresse"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={form.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Code postal"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">-- Type de bien --</option>
            <option value="Appartement">Appartement</option>
            <option value="Maison">Maison</option>
            <option value="Local commercial">Local commercial</option>
            <option value="Parking">Parking</option>
            <option value="Boxe">Boxe</option>
          </select>
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
            name="rooms"
            placeholder="Nombre de pièces"
            value={form.rooms}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="rent"
            placeholder="Loyer (€)"
            value={form.rent}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="charges"
            placeholder="Charges (€)"
            value={form.charges}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          {/* Switch toggle pour isOccupied */}
          <div className="flex items-center justify-between border p-3 rounded">
            <label htmlFor="isOccupied" className="text-sm font-medium text-gray-700">
              Propriété occupée
            </label>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, isOccupied: !prev.isOccupied }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                form.isOccupied ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.isOccupied ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLocked("add-property") || mutation.isLoading}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition disabled:opacity-60"
            >
              {isLocked("add-property") || mutation.isLoading ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyModal;
