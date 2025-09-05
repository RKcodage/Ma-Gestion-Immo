import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { fetchLeasesByRole, deleteLease } from "../api/lease";
import ConfirmModal from "../components/modals/ConfirmModal";
import UpdateLeaseModal from "../components/modals/UpdateLeaseModal";
import { MoreVertical } from "lucide-react";
import Select from "@/components/components/ui/select";
import LeaseCard from "@/components/cards/LeaseCard";
import { toast } from "react-toastify";


export default function Leases() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [leaseToDelete, setLeaseToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [leaseToEdit, setLeaseToEdit] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Leases query
  const {
    data: leases = [],
  } = useQuery({
    queryKey: ["leases", user._id],
    queryFn: () => fetchLeasesByRole(token),
    enabled: !!user?._id && !!token,
  });

  // Search params
  const unitIdFilter = searchParams.get("unitId");
  const propertyIdFilter = searchParams.get("propertyId");
  const leaseIdFilter = searchParams.get("leaseId");

  // Filters
  const properties = Array.from(
    new Set(leases.map((lease) => lease.unitId?.propertyId?._id))
  )
    .map((id) =>
      leases.find((lease) => lease.unitId?.propertyId?._id === id)?.unitId?.propertyId
    )
    .filter(Boolean);

    const units = Array.from(
      new Set(
        leases
          .filter((lease) =>
            propertyIdFilter
              ? lease.unitId?.propertyId?._id === propertyIdFilter
              : true
          )
          .map((lease) => lease.unitId?._id)
      )
    )
      .map((id) => leases.find((lease) => lease.unitId?._id === id)?.unitId)
      .filter(Boolean);
    
  const filteredLeases = leases.filter((lease) => {
    const matchesLease = leaseIdFilter ? lease._id === leaseIdFilter : true;
    const matchesUnit = unitIdFilter ? lease.unitId?._id === unitIdFilter : true;
    const matchesProperty = propertyIdFilter ? lease.unitId?.propertyId?._id === propertyIdFilter : true;
    return matchesLease && matchesUnit && matchesProperty;
  });

  // Reset filters
  const handleResetFilters = () => {
    navigate("/dashboard/leases");
  };

  // Confirm delete lease
  const confirmDelete = async () => {
    if (leaseToDelete) {
      // UI guard: only owners can delete a lease
      if (user?.role !== "Propriétaire") {
        toast.error("Action non autorisée");
        return;
      }
      try {
        await deleteLease(leaseToDelete._id, token);
        toast.success("Bail supprimé avec succès");
        setConfirmDeleteOpen(false);
        setLeaseToDelete(null);
        queryClient.invalidateQueries(["leases", user._id]); // Rafraîchir la liste
      } catch (err) {
        toast.error("Erreur : " + err.message);
      }
    }
  };

  return (
    <div className="px-6 py-2">
      <h1 className="text-2xl font-bold mb-8">
        {user?.role === "Propriétaire" ? "Mes Baux" : "Mes Locations"}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select
          value={propertyIdFilter || ""}
          onValueChange={(val) =>
            setSearchParams((prev) => {
              val ? prev.set("propertyId", val) : prev.delete("propertyId");
              return prev;
            })
          }
          placeholder="Filtrer par propriété"
        >
          {properties.map((prop) => (
            <option key={prop._id} value={prop._id}>
              {prop.address} ({prop.city})
            </option>
          ))}
        </Select>

        <Select
          value={unitIdFilter || ""}
          onValueChange={(val) =>
            setSearchParams((prev) => {
              val ? prev.set("unitId", val) : prev.delete("unitId");
              return prev;
            })
          }
          placeholder="Filtrer par unité"
        >
          {units.map((unit) => (
            <option key={unit._id} value={unit._id}>
              {unit.label}
            </option>
          ))}
        </Select>

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
        <ul className="grid gap-4 sm:grid-cols-2">
          {filteredLeases.map((lease) => (
            <li key={lease._id}>
              <LeaseCard
                lease={lease}
                userRole={user.role}
                onEdit={(l) => setLeaseToEdit(l)}
                onDelete={(l) => {
                  setLeaseToDelete(l);
                  setConfirmDeleteOpen(true);
                }}
                onViewDocuments={(l) => {
                  const leaseId = l._id;
                  const unitId = l.unitId?._id;
                  const propertyId = l.unitId?.propertyId?._id;
                  navigate(
                    `/dashboard/documents?leaseId=${leaseId}&unitId=${unitId}&propertyId=${propertyId}`
                  );
                }}
              />
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
