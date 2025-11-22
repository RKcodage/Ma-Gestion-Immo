import React from "react";
import { useNavigate } from "react-router-dom";
import { DiAptana } from "react-icons/di";
import { FaRegTrashCan } from "react-icons/fa6";

const PropertyCard = ({ property, onEdit, onDelete, onSeeMore }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    if (typeof onSeeMore === "function") {
      onSeeMore(property);
    } else {
      navigate(`/dashboard/property/${property._id}`);
    }
  };

  return (
    <div className="min-w-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col justify-between">
      <div className="space-y-2 mb-4">
        <h3 className="text-lg font-semibold">{property.address}</h3>
        <p className="text-sm text-gray-600">{property.postalCode} {property.city}</p>
        <p className="text-sm text-gray-700">{property.description || "Aucune description."}</p>
        <div className="text-sm text-gray-700 space-y-1">
          <p><span className="font-medium">Type :</span> {property.type || "-"}</p>
          <p><span className="font-medium">Surface :</span> {property.surface ? `${property.surface} m²` : "-"}</p>
          <p><span className="font-medium">Pièces :</span> {property.rooms ?? "-"}</p>
          <p><span className="font-medium">Loyer :</span> {property.rent ? `${property.rent} €` : "-"}</p>
          <p><span className="font-medium">Charges :</span> {property.charges ? `${property.charges} €` : "-"}</p>
          <p><span className="font-medium">Occupée :</span> {property.isOccupied ? "Oui" : "Non"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t flex items-center justify-between gap-3">
        <button
          onClick={handleSeeMore}
          className="text-sm bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
        >
          Voir plus
        </button>
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1.5">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(property)}
                className="p-2 rounded hover:bg-gray-100"
                title="Modifier"
                aria-label="Modifier"
              >
                <DiAptana size={18} className="text-gray-600" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(property)}
                className="p-2 rounded hover:bg-red-50"
                title="Supprimer"
                aria-label="Supprimer"
              >
                <FaRegTrashCan size={16} className="text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
