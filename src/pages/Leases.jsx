import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { fetchLeasesByRole } from "../api/lease";
import ConfirmModal from "../components/modals/ConfirmModal";
import UpdateLeaseModal from "../components/modals/UpdateLeaseModal";
import { MoreVertical } from "lucide-react";

export default function Leases() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [leaseToDelete, setLeaseToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [leaseToEdit, setLeaseToEdit] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const {
    data: leases = [],
  } = useQuery({
    queryKey: ["leases", user._id],
    queryFn: () => fetchLeasesByRole(token),
    enabled: !!user?._id && !!token,
  });

  const unitIdFilter = searchParams.get("unitId");
  const propertyIdFilter = searchParams.get("propertyId");
  const leaseIdFilter = searchParams.get("leaseId");

  const properties = [...new Map(
    leases.map((lease) => [lease.unitId?.propertyId?._id, lease.unitId?.propertyId])
  ).values()].filter(Boolean);

  const units = [...new Map(
    leases.map((lease) => [lease.unitId?._id, lease.unitId])
  ).values()].filter(Boolean);

  const filteredLeases = leases.filter((lease) => {
    const matchesLease = leaseIdFilter ? lease._id === leaseIdFilter : true;
    const matchesUnit = unitIdFilter ? lease.unitId?._id === unitIdFilter : true;
    const matchesProperty = propertyIdFilter ? lease.unitId?.propertyId?._id === propertyIdFilter : true;
    return matchesLease && matchesUnit && matchesProperty;
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

        {(leaseIdFilter || unitIdFilter || propertyIdFilter) && (
          <button
            onClick={handleResetFilters}
            className="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-primary/90"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Leases list */}
      {filteredLeases.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun bail trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {filteredLeases.map((lease) => (
            <li
              key={lease._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition relative"
            >
              <div className="space-y-1 text-sm text-gray-700">
                <p><span className="font-semibold text-gray-900">📍 Adresse :</span> {lease.unitId?.propertyId?.address || "-"} ({lease.unitId?.propertyId?.city || "-"})</p>
                <p><span className="font-semibold text-gray-900">🏷️ Unité :</span> {lease.unitId?.label || "-"}</p>
                <p><span className="font-semibold text-gray-900">👤 Locataire :</span> {lease.tenantId?.userId?.profile?.firstName} {lease.tenantId?.userId?.profile?.lastName}</p>
                <p><span className="font-semibold text-gray-900">📧 Email :</span> {lease.tenantId?.userId?.email}</p>
                <p><span className="font-semibold text-gray-900">📅 Durée :</span> {lease.startDate?.slice(0, 10)} → {lease.endDate?.slice(0, 10) || "indéfinie"}</p>
                <p><span className="font-semibold text-gray-900">💰 Loyer :</span> {lease.rentAmount} €</p>
                <p><span className="font-semibold text-gray-900">📆 Paiement :</span> {lease.paymentDate} du mois</p>
                <p><span className="font-semibold text-gray-900">💸 Charges :</span> {lease.chargesAmount} €</p>
              </div>

              {/* Menu */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setOpenMenuId(openMenuId === lease._id ? null : lease._id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <MoreVertical />
                </button>

                {openMenuId === lease._id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                    <button
                      className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setLeaseToEdit(lease);
                        setOpenMenuId(null);
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      className="w-full text-left text-sm px-4 py-2 text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        setLeaseToDelete(lease);
                        setConfirmDeleteOpen(true);
                        setOpenMenuId(null);
                      }}
                    >
                      Supprimer
                    </button>
                    <button
                      className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        const leaseId = lease._id;
                        const unitId = lease.unitId?._id;
                        const propertyId = lease.unitId?.propertyId?._id;
                        navigate(`/dashboard/documents?leaseId=${leaseId}&unitId=${unitId}&propertyId=${propertyId}`);
                        setOpenMenuId(null);
                      }}                      
                    >
                      Voir les documents
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

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
