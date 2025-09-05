import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { fetchLeasesByRole } from "../api/lease";
import {
  fetchLeaseDocuments,
  downloadLeaseDocument,
  deleteLeaseDocument,
} from "../api/document";
import AddDocumentModal from "../components/modals/AddDocumentModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import DocumentCard from "@/components/cards/DocumentCard";
import { toast } from "react-toastify";
import useClickOutside from "../hooks/useClickOutside";
import { IoIosAddCircle } from "react-icons/io";

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
  const documentId = searchParams.get("documentId");

  const { data: leases = [] } = useQuery({
    queryKey: ["leases", user._id],
    queryFn: () => fetchLeasesByRole(token),
    enabled: !!token && !!user?._id,
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

  const filteredDocuments = documentId
    ? documents.filter((doc) => doc._id === documentId)
    : documents;

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

  const properties = Array.from(
    new Set(leases.map((lease) => lease.unitId?.propertyId?._id))
  )
    .map((id) =>
      leases.find((lease) => lease.unitId?.propertyId?._id === id)?.unitId?.propertyId
    )
    .filter(Boolean);

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
      <h1 className="text-2xl font-bold mb-8">Mes documents</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 transition w-full sm:w-auto flex items-center gap-2"
        >
          <IoIosAddCircle /> Ajouter un document
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

          {(unitIdFilter || propertyIdFilter || documentId) && (
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
      ) : filteredDocuments.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun document trouvé.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filteredDocuments.map((doc) => (
            <li key={doc._id}>
              <DocumentCard
                doc={doc}
                onDownload={(d) => downloadLeaseDocument(d, token)}
                onDelete={(d) => {
                  setSelectedDocId(d._id);
                  setConfirmOpen(true);
                }}
              />
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
          properties={properties}
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
