import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Api
import { getPropertyById } from "../api/property";
import {
  getUnitsWithLeaseCount,
  updateUnit,
  deleteUnit,
} from "../api/unit";
import { fetchOwnerByUserId } from "@/api/owner"

// Stores
import useAuthStore from "../stores/authStore";

// Components
import UnitCard from "../components/properties/units/UnitCard";

// Modals
import AddUnitModal from "../components/modals/AddUnitModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import EditUnitModal from "../components/modals/EditUnitModal";
import CreateLeaseModal from "../components/modals/CreateLeaseModal"; // ✅

export default function PropertyDetails() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  // Modals states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [leaseModalOpen, setLeaseModalOpen] = useState(false); // ✅
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [unitToEdit, setUnitToEdit] = useState(null);
  

  // Property query
  const { data: property, isLoading, isError } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getPropertyById(propertyId, token),
    enabled: !!token,
  });

  // Units query
  const {
    data: units = [],
    isLoading: unitsLoading,
    isError: unitsError,
  } = useQuery({
    queryKey: ["units", propertyId],
    queryFn: () => getUnitsWithLeaseCount(propertyId, token),
    enabled: !!token,
  });

  // Owner query
  const {
    data: owner,
  } = useQuery({
    queryKey: ["owner", user._id],
    queryFn: () => fetchOwnerByUserId(user._id, token),
    enabled: !!user?._id && !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (unitId) => deleteUnit(unitId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["units", propertyId]);
      setConfirmDeleteOpen(false);
    },
    onError: () => {
      alert("Erreur lors de la suppression.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ unitId, updatedData }) =>
      updateUnit({ unitId, values: updatedData, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["units", propertyId]);
      setEditModalOpen(false);
      setUnitToEdit(null);
    },
    onError: () => {
      alert("Erreur lors de la mise à jour.");
    },
  });

  const confirmDelete = () => {
    if (unitToDelete) {
      deleteMutation.mutate(unitToDelete._id);
    }
  };

  if (isLoading) return <p>Chargement des informations...</p>;
  if (isError || !property) return <p>Erreur : propriété introuvable</p>;

  return (
    <div className="px-6">
      {/* BreadCrumb */}
      <nav className="text-sm text-gray-600 flex items-center space-x-2 mb-6">
        <Link to="/dashboard" className="hover:underline text-primary font-medium">Tableau de bord</Link>
        <span>&gt;</span>
        <Link to="/dashboard/properties" className="hover:underline text-primary font-medium">Propriétés</Link>
        <span>&gt;</span>
        <span className="text-gray-800 font-semibold">Détails de la propriété</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">Détails de la propriété</h1>

      {/* Property infos */}
      <div className="bg-white rounded shadow p-4 border space-y-2 relative">
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

        {/* Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            + Ajouter une unité
          </button>
          <button
            onClick={() => setLeaseModalOpen(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            + Créer un bail
          </button>
        </div>
      </div>

      {/* List of units */}
      <div className="pt-6 space-y-4">
        <h2 className="mb-6 text-xl font-semibold">Unités de cette propriété</h2>

        {unitsLoading ? (
          <p>Chargement des unités...</p>
        ) : unitsError ? (
          <p>Erreur lors du chargement des unités.</p>
        ) : units.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune unité pour cette propriété.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit) => (
              <UnitCard
                key={unit._id}
                unit={unit}
                onDelete={() => {
                  setUnitToDelete(unit);
                  setConfirmDeleteOpen(true);
                }}
                onEdit={() => {
                  setUnitToEdit(unit);
                  setEditModalOpen(true);
                }}
                onLeaseClick={(unitId) => {
                  navigate(`/dashboard/leases?unitId=${unitId}`);
                }}
                onDocumentClick={(unitId) => {
                  navigate(`/dashboard/documents?unitId=${unitId}`);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add unit modal */}
      {addModalOpen && (
        <AddUnitModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          propertyId={propertyId}
          token={token}
        />
      )}

      {/* Edit unit modal */}
      {editModalOpen && unitToEdit && (
        <EditUnitModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setUnitToEdit(null);
          }}
          unit={unitToEdit}
          onSubmit={(updatedData) =>
            updateMutation.mutate({ unitId: unitToEdit._id, updatedData })
          }
        />
      )}

      {/* Create lease modal */}
      {leaseModalOpen && (
        <CreateLeaseModal
          open={leaseModalOpen}
          onClose={() => setLeaseModalOpen(false)}
          propertyId={propertyId}
          ownerId={owner}
          units={units}
          token={token}
        />
      )}

      {/* Confirm delete modal */}
      {confirmDeleteOpen && (
        <ConfirmModal
          title="Supprimer cette unité ?"
          message="Cette action est irréversible."
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      )}
    </div>
  );
}
