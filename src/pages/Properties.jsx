import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/data-table/DataTable";
import { columns } from "../components/properties/columns";
import PropertyCarousel from "../components/properties/PropertyCarousel";
import PropertyCard from "../components/properties/PropertyCard";
// Api
import { fetchPropertiesByOwner, deleteProperty } from "../api/property";
import { fetchOwnerByUserId } from "../api/owner";
// Stores
import useAuthStore from "../stores/authStore";
// Modals
import AddPropertyModal from "../components/modals/AddPropertyModal";
import EditPropertyModal from "../components/modals/EditPropertyModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PropertyFiltersModal from "../components/modals/PropertyFiltersModal";
// Icons
import { IoIosAddCircle } from "react-icons/io";
import { ArrowLeft } from "lucide-react";
// Tooltip
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/components/ui/tooltip";
import AddActionButton from "@/components/buttons/AddActionButton";
import SEO from "../components/SEO/SEO";

export default function Properties() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [search, setSearch] = useState("");
  const [mobileFilters, setMobileFilters] = useState({
    city: "",
    type: "",
    occupied: "all", // all | occupied | available
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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

  const uniqueCities = Array.from(
    new Set(properties.map((p) => p.city).filter(Boolean)),
  );
  const uniqueTypes = Array.from(
    new Set(properties.map((p) => p.type).filter(Boolean)),
  );

  const filteredProperties = properties.filter((property) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      property.address.toLowerCase().includes(q) ||
      (property.city || "").toLowerCase().includes(q) ||
      String(property.postalCode || "").includes(q);

    const matchCity = !mobileFilters.city || property.city === mobileFilters.city;
    const matchType = !mobileFilters.type || property.type === mobileFilters.type;
    const matchOccupied =
      mobileFilters.occupied === "all" ||
      (mobileFilters.occupied === "occupied" && property.isOccupied) ||
      (mobileFilters.occupied === "available" && !property.isOccupied);

    return matchSearch && matchCity && matchType && matchOccupied;
  });

  const handleCreateUnit = (property) => {
    alert("Créer une unité pour : " + property.address);
  };
  
  const handleCreateLease = (property) => {
    alert("Créer un bail pour : " + property.address);
  };
  
  const tableRef = useRef(null);

  const handleResetMobileFilters = () => {
    setSearch("");
    setMobileFilters({ city: "", type: "", occupied: "all" });
  };

  const [hasActiveTableFilters, setHasActiveTableFilters] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="px-6 py-2">
      {/* Page SEO */}
      <SEO
        title="Ma Gestion Immo — Mes propriétés"
        description="Gérez vos propriétés, unités et baux depuis votre tableau de bord."
        noIndex
      />
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
            className="transition self-start"
          />
          <TooltipProvider>
            <Tooltip
              open={helpOpen}
              onOpenChange={(open) => {
                if (!open) setHelpOpen(false);
              }}
            >
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Aide"
                  className="rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center self-start w-6 h-6"
                  onClick={() => setHelpOpen((v) => !v)}
                >
                  <span className="text-xs font-semibold text-white">?</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                className="text-black bg-white border border-gray-200 shadow-lg max-w-xs text-xs sm:text-[11px]"
              >
                <span className="block md:hidden">
                  Cliquez sur "voir plus" pour créer des unités et des baux pour cette propriété.
                </span>
                <span className="hidden md:block">
                  Cliquez sur l'adresse d'une propriété pour créer des unités et des baux.
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2 text-sm">
          <input
            type="text"
            placeholder="Rechercher une adresse, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 border rounded-md"
          />
          <button
            onClick={() => {
              handleResetMobileFilters();
              tableRef.current?.resetFilters?.();
            }}
            className="hidden sm:inline-flex bg-primary text-white text-sm px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-60"
            disabled={!hasActiveTableFilters && !search}
            aria-disabled={!hasActiveTableFilters && !search}
          >
            Réinitialiser les filtres
          </button>
          {/* Bouton filtres mobile */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex sm:hidden items-center justify-center text-sm px-4 py-2 border rounded-md bg-white"
          >
            Filtres
          </button>
        </div>
      </div>

      {(ownerLoading || propertiesLoading) ? (
        <p>Chargement...</p>
      ) : isError ? (
        <p>Erreur lors du chargement des propriétés.</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <DataTable
              ref={tableRef}
              data={filteredProperties}
              columns={columns(handleEdit, handleDelete)}
              onFiltersChange={(filters) =>
                setHasActiveTableFilters((filters?.length || 0) > 0)
              }
            />
          </div>

          {/* Mobile */}
          <div className="grid gap-4 md:hidden">
            {filteredProperties.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucune propriété trouvée.
              </p>
            ) : (
              filteredProperties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </>
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

      {/* Properties filters Modal */}
      <PropertyFiltersModal
        open={mobileFiltersOpen}
        filters={mobileFilters}
        onFiltersChange={setMobileFilters}
        onReset={handleResetMobileFilters}
        onClose={() => setMobileFiltersOpen(false)}
        cities={uniqueCities}
        types={uniqueTypes}
      />
    </div>
  );
}
