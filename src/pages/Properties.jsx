import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/data-table/DataTable";
import { columns } from "../components/properties/columns";
import PropertyCarousel from "../components/properties/PropertyCarousel";
// Api
import { fetchPropertiesByOwner, deleteProperty } from "../api/property";
import { fetchOwnerByUserId } from "../api/owner";
// Stores
import useAuthStore from "../stores/authStore";
// Modals
import AddPropertyModal from "../components/modals/AddPropertyModal";
import EditPropertyModal from "../components/modals/EditPropertyModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
// Icons
import { IoIosAddCircle } from "react-icons/io";
import { ArrowLeft, HelpCircle } from "lucide-react";
// Tooltip
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/components/ui/tooltip";
import AddActionButton from "@/components/buttons/AddActionButton";

export default function Properties() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const queryClient = useQueryClient();

  const { data: owner, isLoading: ownerLoading } = useQuery({
    queryKey: ["owner", user?._id],
    queryFn: () => fetchOwnerByUserId(user._id, token),
    enabled: !!user?._id && !!token,
  });

  const { data: properties = [], isLoading: propertiesLoading, isError } = useQuery({
    queryKey: ["properties", owner?._id],
    queryFn: () => fetchPropertiesByOwner(owner._id, token),
    enabled: !!owner?._id && !!token,
  });

  // Edit
  const handleEdit = (property) => {
    setSelectedProperty(property);
    setEditModalOpen(true);
  };

  // Delete
  const handleDelete = (property) => {
    setPropertyToDelete(property);
    setConfirmDeleteOpen(true);
  };

  // Delete mutation 
  const deleteMutation = useMutation({
    mutationFn: ({ propertyId, token }) => deleteProperty({ propertyId, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties", owner?._id]);
      setConfirmDeleteOpen(false);
    },
    onError: () => {
      alert("Erreur lors de la suppression");
    },
  });

  const confirmDelete = () => {
    if (propertyToDelete) {
      deleteMutation.mutate({ propertyId: propertyToDelete._id, token });
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUnit = (property) => {
    alert("Créer une unité pour : " + property.address);
  };
  
  const handleCreateLease = (property) => {
    alert("Créer un bail pour : " + property.address);
  };
  
  const tableRef = useRef(null);

  const [hasActiveTableFilters, setHasActiveTableFilters] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="px-6 py-2">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          aria-label="Retour"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold">Mes Propriétés</h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:items-end mb-6 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <AddActionButton
            onClick={() => setModalOpen(true)}
            label="Ajouter une propriété"
            icon={IoIosAddCircle}
            variant="primary"
            size="md"
            className="transition flex-1 sm:flex-none"
          />
          <TooltipProvider>
            <Tooltip open={helpOpen} onOpenChange={(o) => { if (!o) setHelpOpen(false); }}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Aide"
                  className="rounded-full border border-primary bg-primary hover:bg-primary/90 flex items-center justify-center self-start"
                  onClick={() => setHelpOpen((v) => !v)}
                >
                  <HelpCircle className="w-4 h-4 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-black bg-white border border-gray-200 shadow-lg pointer-events-none">
                Cliquez sur l’adresse d’une propriété pour créer des unités et des baux.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2 text-sm">
          <input
            type="text"
            placeholder="Rechercher une adresse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 border rounded-md"
          />
          <button
            onClick={() => {
              setSearch("");
              tableRef.current?.resetFilters?.();
            }}
            className="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-60"
            disabled={!hasActiveTableFilters && !search}
            aria-disabled={!hasActiveTableFilters && !search}
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {(ownerLoading || propertiesLoading) ? (
        <p>Chargement...</p>
      ) : isError ? (
        <p>Erreur lors du chargement des propriétés.</p>
      ) : (
        <DataTable
          ref={tableRef}
          data={filteredProperties}
          columns={columns(handleEdit, handleDelete)}
          onFiltersChange={(filters) => setHasActiveTableFilters((filters?.length || 0) > 0)}
        />
      )}

{filteredProperties.length > 0 && (
  <PropertyCarousel
    properties={filteredProperties}
    onCreateUnit={(property) => console.log("Créer unité pour", property)}
    onCreateLease={(property) => console.log("Créer bail pour", property)}
  />
)}


      {/* Add Modal */}
      {modalOpen && (
        <AddPropertyModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          ownerId={owner._id}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedProperty && (
        <EditPropertyModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          property={selectedProperty}
        />
      )}

      {/* Delete Modal */}
      {confirmDeleteOpen && (
        <ConfirmModal
          title="Supprimer cette propriété ?"
          message="Attention : cette action est irréversible."
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      )}
    </div>
  );
}
