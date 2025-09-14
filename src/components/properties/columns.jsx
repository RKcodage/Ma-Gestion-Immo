import { Check, X } from "lucide-react";
import { DiAptana } from "react-icons/di";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";

// Column definitions for TanStack Table
export const columns = (onEdit, onDelete) => [
  {
    accessorKey: "address",
    header: "Adresse",
    // text filter by default
    cell: ({ row }) => {
      const p = row.original;
      return (
        <Link
          to={`/dashboard/property/${p._id}`}
          className="text-primary hover:underline"
          title="Voir la propriété"
        >
          {p.address}
        </Link>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Ville",
    meta: { filterVariant: "checkbox" },
    filterFn: (row, columnId, filterValue) => {
      const selected = Array.isArray(filterValue) ? filterValue : [];
      if (selected.length === 0) return true;
      const v = row.getValue(columnId);
      return selected.includes(String(v ?? ""));
    },
  },
  {
    accessorKey: "postalCode",
    header: "Code Postal",
    // text filter by default
  },
  {
    accessorKey: "type",
    header: "Type",
    meta: { filterVariant: "checkbox" },
    filterFn: (row, columnId, filterValue) => {
      const selected = Array.isArray(filterValue) ? filterValue : [];
      if (selected.length === 0) return true;
      const v = row.getValue(columnId);
      return selected.includes(String(v ?? ""));
    },
  },
  {
    accessorKey: "surface",
    header: "Surface (m²)",
    cell: ({ row }) => {
      const value = row.original?.surface;
      return value ? `${value} m²` : "-";
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "rooms",
    header: "Pièces",
    cell: ({ row }) => row.original?.rooms ?? "-",
    enableColumnFilter: false,
  },
  {
    accessorKey: "rent",
    header: "Loyer (€)",
    cell: ({ row }) => {
      const value = row.original?.rent;
      return value ? `${value} €` : "-";
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "charges",
    header: "Charges (€)",
    cell: ({ row }) => {
      const value = row.original?.charges;
      return value ? `${value} €` : "-";
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "isOccupied",
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
    meta: { filterVariant: "boolean" },
    filterFn: (row, columnId, filterValue) => {
      const arr = Array.isArray(filterValue) ? filterValue : [];
      if (arr.length === 0) return true;
      const v = !!row.getValue(columnId);
      return arr.includes(String(v));
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original?.description || "-",
    // text filter by default
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
            className="p-2 rounded hover:bg-gray-100 transition"
            title="Modifier"
            aria-label="Modifier"
          >
            <DiAptana size={18} className="text-gray-600" />
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
    enableColumnFilter: false,
  },
];
