import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { fetchOwnerByUserId } from "../api/owner";
import { fetchLeasesByOwner } from "../api/lease";
import {
  fetchLeaseDocuments,
  downloadLeaseDocument,
  deleteLeaseDocument,
} from "../api/document";
import AddDocumentModal from "../components/modals/AddDocumentModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import useClickOutside from "../hooks/useClickOutside";

export default function Documents() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [menuOpenDocId, setMenuOpenDocId] = useState(null);

  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpenDocId(null));

  const unitIdFilter = searchParams.get("unitId");
  const propertyIdFilter = searchParams.get("propertyId");

  const { data: owner } = useQuery({
    queryKey: ["owner", user._id],
    queryFn: () => fetchOwnerByUserId(user._id, token),
    enabled: !!user._id && user.role === "Propriétaire",
  });

  const { data: leases = [] } = useQuery({
    queryKey: ["leases", owner?._id],
    queryFn: () => fetchLeasesByOwner(owner._id, token),
    enabled: user.role === "Propriétaire" && !!owner?._id,
  });

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", propertyIdFilter, unitIdFilter],
    queryFn: () =>
      fetchLeaseDocuments(token, {
        propertyId: propertyIdFilter,
        unitId: unitIdFilter,
      }),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteLeaseDocument(id, token),
    onSuccess: () => {
      toast.success("Document supprimé");
      queryClient.invalidateQueries({ queryKey: ["documents"], exact: false });
      setConfirmOpen(false);
      setMenuOpenDocId(null);
    },
    onError: (err) => {
      console.error("Delete error:", err);
      setConfirmOpen(false);
      setMenuOpenDocId(null);
    },
  });

  // Filter properties
  const properties = Array.from(
    new Set(leases.map((lease) => lease.unitId?.propertyId?._id))
  )
    .map((id) =>
      leases.find((lease) => lease.unitId?.propertyId?._id === id)?.unitId?.propertyId
    )
    .filter(Boolean);

    // Filter units
    const allUnits = Array.from(
      new Set(leases.map((lease) => lease.unitId?._id))
    )
      .map((id) => leases.find((lease) => lease.unitId?._id === id)?.unitId)
      .filter(Boolean);
    
    const units = propertyIdFilter
      ? allUnits.filter((unit) => unit?.propertyId?._id === propertyIdFilter)
      : allUnits;
    
  const handleResetFilters = () => {
    navigate("/dashboard/documents");
  };

  return (
    <div className="px-6 py-2">
      <h1 className="text-2xl font-bold mb-6">Mes documents</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-primary/90"
        >
          + Ajouter un document
        </button>

        <div className="flex gap-4 items-center">
          <select
            value={propertyIdFilter || ""}
            onChange={(e) =>
              setSearchParams((prev) => {
                e.target.value
                  ? prev.set("propertyId", e.target.value)
                  : prev.delete("propertyId");
                return prev;
              })
            }
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="">Filtrer par propriété</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.address} ({p.city})
              </option>
            ))}
          </select>

          <select
            value={unitIdFilter || ""}
            onChange={(e) =>
              setSearchParams((prev) => {
                e.target.value
                  ? prev.set("unitId", e.target.value)
                  : prev.delete("unitId");
                return prev;
              })
            }
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="">Filtrer par unité</option>
            {units.map((u) => (
              <option key={u._id} value={u._id}>
                {u.label}
              </option>
            ))}
          </select>

          {(unitIdFilter || propertyIdFilter) && (
            <button
              onClick={handleResetFilters}
              className="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-primary/90"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p>Chargement des documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun document trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc._id} className="bg-white border rounded p-4 shadow-sm relative">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() =>
                    setMenuOpenDocId((prev) => (prev === doc._id ? null : doc._id))
                  }
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>
                {menuOpenDocId === doc._id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 bg-white border shadow rounded w-32 z-10"
                  >
                    <button
                      onClick={() => {
                        setSelectedDocId(doc._id);
                        setConfirmOpen(true);
                        setMenuOpenDocId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

              <p><strong>Nom :</strong> {doc.name}</p>
              <p><strong>Type :</strong> {doc.type}</p>
              <p><strong>Adresse :</strong> {doc.leaseId?.unitId?.propertyId?.address} ({doc.leaseId?.unitId?.propertyId?.city})</p>
              <p><strong>Unité :</strong> {doc.leaseId?.unitId?.label}</p>
              <p>
                <strong>Locataire :</strong>{" "}
                {doc.leaseId?.tenantId?.userId?.profile?.firstName}{" "}
                {doc.leaseId?.tenantId?.userId?.profile?.lastName}
              </p>
              <p><strong>Ajouté le :</strong> {new Date(doc.uploadedAt).toLocaleDateString()}</p>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => downloadLeaseDocument(doc, token)}
                  className="bg-primary text-white text-sm px-4 py-1 rounded hover:bg-primary/90"
                >
                  Télécharger
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <AddDocumentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          leases={leases}
          units={units}
          token={token}
        />
      )}

      {confirmOpen && (
        <ConfirmModal
          title="Supprimer ce document ?"
          message="Cette action est irréversible."
          confirmLabel="Supprimer"
          onCancel={() => {
            setConfirmOpen(false);
            setSelectedDocId(null);
          }}
          onConfirm={() => deleteMutation.mutate(selectedDocId)}
        />
      )}
    </div>
  );
}
