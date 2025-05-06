import { useState, useEffect } from "react";

const EditUnitModal = ({ open, onClose, unit, onSubmit }) => {
  const [formData, setFormData] = useState({
    label: "",
    type: "",
    floor: "",
    surface: "",
    rentAmount: "",
    chargesAmount: "",
    description: "",
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        label: unit.label || "",
        type: unit.type || "",
        floor: unit.floor || "",
        surface: unit.surface || "",
        rentAmount: unit.rentAmount || "",
        chargesAmount: unit.chargesAmount || "",
        description: unit.description || "",
      });
    }
  }, [unit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">Modifier l’unité</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1">Nom de l’unité</label>
            <input
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Appartement">Appartement</option>
              <option value="Parking">Parking</option>
              <option value="Boxe">Boxe</option>
              <option value="Local commercial">Local commercial</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Étage</label>
            <input
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Surface (m²)</label>
            <input
              name="surface"
              type="number"
              value={formData.surface}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Loyer (€)</label>
            <input
              name="rentAmount"
              type="number"
              value={formData.rentAmount}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Charges (€)</label>
            <input
              name="chargesAmount"
              type="number"
              value={formData.chargesAmount}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUnitModal;
