import React, { useState } from "react";
import { FileText, Home, MoreVertical } from "lucide-react";

export default function UnitCard({ unit, onDelete, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative bg-white border rounded-lg shadow-sm p-4 space-y-2 w-full max-w-md">
      {/* Bouton menu 3 points */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-gray-500 hover:text-gray-700"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10 w-36">
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit?.(unit);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Modifier
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete?.();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Home className="w-4 h-4 text-gray-500" />
        {unit.label}
      </h3>

      <p className="text-sm text-gray-600"><strong>Type :</strong> {unit.type}</p>
      {unit.floor && <p className="text-sm text-gray-600"><strong>Étage :</strong> {unit.floor}</p>}
      {unit.surface && <p className="text-sm text-gray-600"><strong>Surface :</strong> {unit.surface} m²</p>}
      {unit.rentAmount && <p className="text-sm text-gray-600"><strong>Loyer :</strong> {unit.rentAmount} €</p>}
      {unit.chargesAmount && <p className="text-sm text-gray-600"><strong>Charges :</strong> {unit.chargesAmount} €</p>}
      {unit.description && <p className="text-sm text-gray-600"><strong>Description :</strong> {unit.description}</p>}

      <div className="flex items-center gap-1 text-sm text-gray-700 pt-2">
        <FileText className="w-4 h-4" />
        {unit.leaseCount > 0
          ? `${unit.leaseCount} bail${unit.leaseCount > 1 ? "s" : ""}`
          : "Aucun bail"}
      </div>
    </div>
  );
}
