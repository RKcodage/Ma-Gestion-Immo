import { X } from "lucide-react";

export default function PropertyFiltersModal({
  open,
  filters,
  onFiltersChange,
  onReset,
  onClose,
  cities = [],
  types = [],
}) {
  if (!open) return null;

  const handleChange = (patch) => {
    onFiltersChange((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 md:hidden">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtres</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Fermer les filtres"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Ville
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleChange({ city: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleChange({ type: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Tous les types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Occupation
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleChange({ occupied: "all" })}
                className={`flex-1 px-3 py-2 rounded border text-xs ${
                  filters.occupied === "all"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700"
                }`}
              >
                Toutes
              </button>
              <button
                type="button"
                onClick={() => handleChange({ occupied: "occupied" })}
                className={`flex-1 px-3 py-2 rounded border text-xs ${
                  filters.occupied === "occupied"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700"
                }`}
              >
                Occupées
              </button>
              <button
                type="button"
                onClick={() => handleChange({ occupied: "available" })}
                className={`flex-1 px-3 py-2 rounded border text-xs ${
                  filters.occupied === "available"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700"
                }`}
              >
                Libres
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded border text-sm"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-primary text-white text-sm"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

