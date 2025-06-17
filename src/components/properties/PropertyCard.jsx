import React from "react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property, onCreateUnit, onCreateLease }) => {
  const navigate = useNavigate();

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

      {/* Bouton centré */}
      <div className="pt-4 border-t flex justify-center">
        <button
          onClick={() => navigate(`/dashboard/property/${property._id}`)}
          className="text-sm bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
        >
          Voir plus
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
