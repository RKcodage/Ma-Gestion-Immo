import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/components/ui/table";
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
import { IoIosAddCircle } from "react-icons/io";
import { ArrowLeft } from "lucide-react";

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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition w-full sm:w-auto flex items-center gap-2"
        >
          <IoIosAddCircle /> Ajouter une propriété
        </button>

        <input
          type="text"
          placeholder="Rechercher une adresse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border rounded-md"
        />
      </div>

      {(ownerLoading || propertiesLoading) ? (
        <p>Chargement...</p>
      ) : isError ? (
        <p>Erreur lors du chargement des propriétés.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns(handleEdit, handleDelete).map((col) => (
                <TableHead key={col.accessorKey || col.id}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((row) => (
                <TableRow key={row._id}>
                  {columns(handleEdit, handleDelete).map((col) => (
                    <TableCell key={col.accessorKey || col.id}>
                      {col.cell ? col.cell({ row }) : row[col.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns(handleEdit, handleDelete).length} className="text-center">
                  Aucune propriété trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
