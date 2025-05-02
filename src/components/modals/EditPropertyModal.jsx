import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProperty } from "../../api/property";
import { toast } from "react-toastify";
import useAuthStore from "../../stores/authStore";

const EditPropertyModal = ({ open, onClose, property }) => {
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

  useEffect(() => {
    if (property) {
      setForm({
        address: property.address || "",
        city: property.city || "",
        postalCode: property.postalCode || "",
        description: property.description || "",
        type: property.type || "",
        surface: property.surface || "",
        rooms: property.rooms || "",
        rent: property.rent || "",
        charges: property.charges || "",
        isOccupied: property.isOccupied || false,
      });
    }
  }, [property]);

  const mutation = useMutation({
    mutationFn: (data) => updateProperty({ propertyId: property._id, values: data, token }),
    onSuccess: () => {
      toast.success("Propriété mise à jour !");
      queryClient.invalidateQueries(["properties", property.ownerId._id]);
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
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
          <DialogTitle>Modifier la propriété</DialogTitle>
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

          {/* Switch personnalisé pour isOccupied */}
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
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
