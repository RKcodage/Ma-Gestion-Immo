import { Check, X } from "lucide-react";
import { DiAptana } from "react-icons/di";
import { FaRegTrashCan } from "react-icons/fa6";

// Column definitions for TanStack Table
export const columns = (onEdit, onDelete) => [
  {
    accessorKey: "address",
    header: "Adresse",
  },
  {
    accessorKey: "city",
    header: "Ville",
  },
  {
    accessorKey: "postalCode",
    header: "Code Postal",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "surface",
    header: "Surface (m²)",
    cell: ({ row }) => {
      const value = row.original?.surface;
      return value ? `${value} m²` : "-";
    },
  },
  {
    accessorKey: "rooms",
    header: "Pièces",
    cell: ({ row }) => row.original?.rooms ?? "-",
  },
  {
    accessorKey: "rent",
    header: "Loyer (€)",
    cell: ({ row }) => {
      const value = row.original?.rent;
      return value ? `${value} €` : "-";
    },
  },
  {
    accessorKey: "charges",
    header: "Charges (€)",
    cell: ({ row }) => {
      const value = row.original?.charges;
      return value ? `${value} €` : "-";
    },
  },
  {
    id: "isOccupied",
    header: "Occupée",
    cell: ({ row }) => {
      const isOccupied = !!row.original?.isOccupied;
      return (
        <div className="flex items-center justify-center">
          {isOccupied ? (
            <Check className="text-green-500 w-5 h-5" />
          ) : (
            <X className="text-red-500 w-5 h-5" />
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original?.description || "-",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(property)}
            className="p-2 rounded hover:bg-blue-50 transition"
            title="Modifier"
            aria-label="Modifier"
          >
            <DiAptana size={18} className="text-blue-600" />
          </button>

          <button
            onClick={() => onDelete(property)}
            className="p-2 rounded hover:bg-red-50 transition"
            title="Supprimer"
            aria-label="Supprimer"
          >
            <FaRegTrashCan size={16} className="text-red-600" />
          </button>
        </div>
      );
    },
    enableSorting: false,
  },
];
