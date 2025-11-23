import React, { useEffect, useRef, useState } from "react";
import { FileText, Home, MoreVertical, Pen } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../../components/ui/tooltip";
import useClickOutside from "../../../hooks/useClickOutside";

export default function UnitCard({ unit, onDelete, onEdit, onLeaseClick, onDocumentClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the action menu when clicking outside
  useClickOutside(menuRef, () => setMenuOpen(false));

  // Close the menu with Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="relative bg-white border rounded-lg shadow-sm p-4 space-y-2 w-full max-w-md">
      {/* Dots menu */}
      <div className="absolute top-2 right-2" ref={menuRef}>
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

      <TooltipProvider>
        <div className="flex items-center gap-4 text-sm text-gray-700 pt-2">
          <div className="flex items-center gap-1">
            <Pen className="w-4 h-4 text-primary" />
            {unit.leaseCount > 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-primary" onClick={() => onLeaseClick(unit._id)}>
                    {unit.leaseCount} {unit.leaseCount > 1 ? "baux" : "bail"}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voir les baux de cette unité</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span>Aucun bail</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-primary" />
            {unit.documentCount > 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-primary"
                    onClick={() => onDocumentClick?.(unit._id)}
                  >
                    {unit.documentCount} document{unit.documentCount > 1 ? "s" : ""}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voir les documents de cette unité</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span>Aucun document</span>
            )}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
