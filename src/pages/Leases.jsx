import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { fetchLeasesByOwner } from "../api/lease";
import { fetchOwnerByUserId } from "../api/owner";
import ConfirmModal from "../components/modals/ConfirmModal";
import UpdateLeaseModal from "../components/modals/UpdateLeaseModal";

export default function Leases() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [leaseToDelete, setLeaseToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [leaseToEdit, setLeaseToEdit] = useState(null);

  const {
    data: owner,
    isLoading: ownerLoading,
    isError: ownerError,
  } = useQuery({
    queryKey: ["owner", user._id],
    queryFn: () => fetchOwnerByUserId(user._id, token),
    enabled: !!user?._id && !!token,
  });

  const {
    data: leases = [],
    isLoading: leasesLoading,
    isError: leasesError,
  } = useQuery({
    queryKey: ["leases", owner?._id],
    queryFn: () => fetchLeasesByOwner(owner._id, token),
    enabled: !!owner?._id && !!token,
  });

  const unitIdFilter = searchParams.get("unitId");
  const propertyIdFilter = searchParams.get("propertyId");

  const properties = Array.from(
    new Set(leases.map((lease) => lease.unitId?.propertyId?._id))
  ).map((id) =>
    leases.find((lease) => lease.unitId?.propertyId?._id === id)?.unitId?.propertyId
  ).filter(Boolean);

  const units = Array.from(
    new Set(leases.map((lease) => lease.unitId?._id))
  ).map((id) =>
    leases.find((lease) => lease.unitId?._id === id)?.unitId
  ).filter(Boolean);

  const filteredLeases = leases.filter((lease) => {
    const matchesUnit = unitIdFilter ? lease.unitId?._id === unitIdFilter : true;
    const matchesProperty = propertyIdFilter ? lease.unitId?.propertyId?._id === propertyIdFilter : true;
    return matchesUnit && matchesProperty;
  });

  const handleResetFilters = () => {
    navigate("/dashboard/leases");
  };

  const confirmDelete = () => {
    if (leaseToDelete) {
      console.log("Suppression du bail :", leaseToDelete._id);
      setConfirmDeleteOpen(false);
    }
  };

  return (
    <div className="px-6 py-2">
      <h1 className="text-2xl font-bold mb-6">Mes baux</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={propertyIdFilter || ""}
          onChange={(e) =>
            setSearchParams((prev) => {
              e.target.value ? prev.set("propertyId", e.target.value) : prev.delete("propertyId");
              return prev;
            })
          }
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="">Filtrer par propriété</option>
          {properties.map((prop) => (
            <option key={prop._id} value={prop._id}>
              {prop.address} ({prop.city})
            </option>
          ))}
        </select>

        <select
          value={unitIdFilter || ""}
          onChange={(e) =>
            setSearchParams((prev) => {
              e.target.value ? prev.set("unitId", e.target.value) : prev.delete("unitId");
              return prev;
            })
          }
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="">Filtrer par unité</option>
          {units.map((unit) => (
            <option key={unit._id} value={unit._id}>
              {unit.label}
            </option>
          ))}
        </select>

        {(unitIdFilter || propertyIdFilter) && (
          <button
            onClick={handleResetFilters}
            className="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-primary/90"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Liste des baux */}
      {filteredLeases.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun bail trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {filteredLeases.map((lease) => (
            <li key={lease._id} className="bg-white border rounded p-4 shadow-sm space-y-1 relative">
              <p><strong>Adresse :</strong> {lease.unitId?.propertyId?.address || "-"} ({lease.unitId?.propertyId?.city || "-"})</p>
              <p><strong>Unité :</strong> {lease.unitId?.label || "-"}</p>
              <p><strong>Locataire :</strong> {lease.tenantId?.userId?.profile?.firstName} {lease.tenantId?.userId?.profile?.lastName}</p>
              <p><strong>Email :</strong> {lease.tenantId?.userId?.email}</p>
              <p><strong>Durée :</strong> {lease.startDate?.slice(0, 10)} → {lease.endDate?.slice(0, 10) || "indéfinie"}</p>
              <p><strong>Loyer :</strong> {lease.rentAmount} €</p>
              <p><strong>Charges :</strong> {lease.chargesAmount} €</p>

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  className="text-sm text-white bg-primary px-3 py-1 rounded hover:bg-primary/90"
                  onClick={() => setLeaseToEdit(lease)}
                >
                  Modifier
                </button>
                <button
                  className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => {
                    setLeaseToDelete(lease);
                    setConfirmDeleteOpen(true);
                  }}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete lease modal */}
      {confirmDeleteOpen && (
        <ConfirmModal
          title="Supprimer ce bail ?"
          message="Cette action est irréversible."
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      )}

      {/* Modal d’édition */}
      {leaseToEdit && (
        <UpdateLeaseModal
          open={!!leaseToEdit}
          lease={leaseToEdit}
          token={token}
          onClose={() => setLeaseToEdit(null)}
        />
      )}
    </div>
  );
}
