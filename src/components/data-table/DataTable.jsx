import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
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
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronsUpDown } from "lucide-react";

const DataTable = ({ columns, data, pageSize = 10, onFiltersChange }, ref) => {
  const [sorting, setSorting] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [columnFilters, setColumnFilters] = useState([]);
  const [openFilter, setOpenFilter] = useState({ id: null, rect: null });

  const toggleFilter = (colId, targetEl) =>
    setOpenFilter((prev) =>
      prev.id === colId
        ? { id: null, rect: null }
        : { id: colId, rect: targetEl?.getBoundingClientRect?.() || null }
    );

  // Close all dropdowns on outside click or Escape
  useEffect(() => {
    const onDocClick = (e) => {
      const target = e.target;
      if (!(target.closest && (target.closest('.dt-filter') || target.closest('.dt-filter-toggle')))) {
        setOpenFilter({ id: null, rect: null });
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenFilter({ id: null, rect: null });
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChange?.(columnFilters);
  }, [columnFilters, onFiltersChange]);

  useImperativeHandle(ref, () => ({
    resetFilters: () => {
      setColumnFilters([]);
      setOpenFilters({});
      table.resetColumnFilters?.();
      table.setPageIndex(0);
      setPageIndex(0);
      setOpenFilter({ id: null, rect: null });
    },
  }));

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
                  const colId = header.column.id;
                  const canFilter = header.column.getCanFilter();
                  const isOpen = openFilter.id === colId;
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div className="relative">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              className="text-left hover:underline dt-filter-toggle"
                              onClick={(e) => toggleFilter(colId, e.currentTarget)}
                              aria-expanded={isOpen}
                              aria-controls={`filter-${colId}`}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </button>
                            {canSort && (
                              <button
                                type="button"
                                onClick={header.column.getToggleSortingHandler()}
                                aria-label="Trier"
                                className="text-gray-500 hover:text-gray-800"
                              >
                                {sortDir === "asc" ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : sortDir === "desc" ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronsUpDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                          {/* Dropdown is rendered in a portal below */}
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

      {openFilter.id && openFilter.rect &&
        createPortal(
          <div
            className="dt-filter fixed z-[1000] w-64 rounded-md border bg-white p-2 shadow-lg"
            style={{
              left: Math.min(openFilter.rect.left, Math.max(0, window.innerWidth - 272)),
              top: Math.min(openFilter.rect.bottom + 4, window.innerHeight - 8),
            }}
          >
            {(() => {
              const col = table.getColumn(openFilter.id);
              return col ? <ColumnFilterInput column={col} /> : null;
            })()}
          </div>,
          document.body
        )}

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
            className="inline-flex items-center text-sm justify-center border rounded px-4 py-2 bg-white disabled:opacity-50"
            onClick={() => {
              table.previousPage();
              setPageIndex((i) => Math.max(0, i - 1));
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </button>
          <button
            className="inline-flex items-center text-sm justify-center border rounded px-4 py-2 bg-primary text-white disabled:opacity-50"
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
};

export default forwardRef(DataTable);

function ColumnFilterInput({ column }) {
  const meta = column.columnDef.meta || {};
  const variant = meta.filterVariant || "text";

  if (variant === "checkbox" || variant === "boolean") {
    const selected = Array.isArray(column.getFilterValue()) ? column.getFilterValue() : [];
    const options = variant === "boolean"
      ? ["true", "false"]
      : Array.from(column.getFacetedUniqueValues()?.keys?.() || [])
          .map((v) => String(v))
          .sort((a, b) => a.localeCompare(b));

    const toggle = (opt, checked) => {
      const set = new Set(selected);
      if (checked) set.add(opt);
      else set.delete(opt);
      const next = Array.from(set);
      column.setFilterValue(next.length ? next : undefined);
    };

    return (
      <div className="max-h-40 overflow-auto p-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-gray-500">Filtrer</span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => column.setFilterValue(undefined)}
              className="text-[11px] text-primary hover:underline"
            >
              Effacer
            </button>
          )}
        </div>
        <div className="space-y-1">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                className="accent-primary"
                checked={selected.includes(opt)}
                onChange={(e) => toggle(opt, e.target.checked)}
              />
              <span>{variant === "boolean" ? (opt === "true" ? "Oui" : "Non") : opt}</span>
            </label>
          ))}
          {options.length === 0 && (
            <div className="text-[11px] text-gray-400">Aucune option</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <input
      type="text"
      placeholder="Filtrer..."
      className="mt-1 w-full border rounded px-2 py-1 text-xs"
      value={column.getFilterValue() ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
    />
  );
}
