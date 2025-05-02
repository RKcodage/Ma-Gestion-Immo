import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPropertyById } from "../api/property";
import useAuthStore from "../stores/authStore";
import { useEffect } from "react";

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const token = useAuthStore((state) => state.token);

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getPropertyById(propertyId, token),
    enabled: !!token,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return <p>Chargement des informations...</p>;
  if (isError || !property) return <p>Erreur : propriété introuvable</p>;

  return (
    <div className="px-6 space-y-6">
      {/* Fil d’Ariane */}
      <nav className="text-sm text-gray-600 flex items-center space-x-2">
        <Link to="/dashboard" className="hover:underline text-primary font-medium">Tableau de bord</Link>
        <span>&gt;</span>
        <Link to="/dashboard/properties" className="hover:underline text-primary font-medium">Propriétés</Link>
        <span>&gt;</span>
        <span className="text-gray-800 font-semibold">Détails de la propriété</span>
      </nav>

      <h1 className="text-2xl font-bold">Détails de la propriété</h1>

      <div className="bg-white rounded shadow p-4 border space-y-2">
        <p><strong>Adresse :</strong> {property.address}</p>
        <p><strong>Ville :</strong> {property.city}</p>
        <p><strong>Code postal :</strong> {property.postalCode}</p>
        <p><strong>Description :</strong> {property.description || "-"}</p>
        <p><strong>Type :</strong> {property.type}</p>
        <p><strong>Surface :</strong> {property.surface} m²</p>
        <p><strong>Pièces :</strong> {property.rooms}</p>
        <p><strong>Loyer :</strong> {property.rent} €</p>
        <p><strong>Charges :</strong> {property.charges} €</p>
        <p><strong>Occupée :</strong> {property.isOccupied ? "Oui" : "Non"}</p>
      </div>

      {/* Zone pour création */}
      <div className="flex gap-4 pt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Ajouter une unité
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Créer un bail
        </button>
      </div>
    </div>
  );
}
