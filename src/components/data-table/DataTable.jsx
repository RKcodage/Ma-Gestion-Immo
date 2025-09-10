import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/components/ui/table";
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function DataTable({ columns, data, pageSize = 10 }) {
  const [sorting, setSorting] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  return (
    <div className="w-full">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id} className={canSort ? "cursor-pointer select-none" : undefined} onClick={canSort ? header.column.getToggleSortingHandler() : undefined}>
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : sortDir === "desc" ? <ChevronDown className="w-3.5 h-3.5" /> : null
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  Aucune donnée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-3">
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center border rounded px-2 py-1 bg-white disabled:opacity-50"
            onClick={() => {
              table.setPageIndex(0);
              setPageIndex(0);
            }}
            disabled={!table.getCanPreviousPage()}
            aria-label="Première page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            className="inline-flex items-center justify-center border rounded px-6 py-2 bg-white disabled:opacity-50"
            onClick={() => {
              table.previousPage();
              setPageIndex((i) => Math.max(0, i - 1));
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </button>
          <button
            className="inline-flex items-center justify-center border rounded px-6 py-2 bg-primary text-white disabled:opacity-50"
            onClick={() => {
              table.nextPage();
              setPageIndex((i) => i + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </button>
          <button
            className="inline-flex items-center justify-center border rounded px-2 py-1 bg-white disabled:opacity-50"
            onClick={() => {
              const last = table.getPageCount() - 1;
              table.setPageIndex(last);
              setPageIndex(last);
            }}
            disabled={!table.getCanNextPage()}
            aria-label="Dernière page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

