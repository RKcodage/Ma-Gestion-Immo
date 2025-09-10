import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import CreateLeaseModal from "../components/modals/CreateLeaseModal"; 
// Icons
import { IoIosAddCircle } from "react-icons/io";
import AddActionButton from "@/components/buttons/AddActionButton";
import { ArrowLeft } from "lucide-react";

export default function PropertyDetails() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  // States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [leaseModalOpen, setLeaseModalOpen] = useState(false); 
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
      alert("Error while deleting");
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
      alert("Error while updating");
    },
  });

  const confirmDelete = () => {
    if (unitToDelete) {
      deleteMutation.mutate(unitToDelete._id);
    }
  };

  if (isLoading) return <p>Chargement des informations...</p>;
  if (isError || !property) return <p>Erreur : propriété introuvable</p>;

  const hasUnits = Array.isArray(units) && units.length > 0;

  return (
    <div className="px-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          aria-label="Retour"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold">Détails de la propriété</h1>
      </div>

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
          <AddActionButton
            onClick={() => setAddModalOpen(true)}
            label="Ajouter une unité"
            icon={IoIosAddCircle}
            variant="primary"
          />
          <AddActionButton
            onClick={() => setLeaseModalOpen(true)}
            label="Créer un bail"
            icon={IoIosAddCircle}
            variant="teal"
            disabled={!hasUnits}
            title={hasUnits ? "Créer un bail" : "Ajoutez d’abord une unité pour créer un bail"}
          />
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
