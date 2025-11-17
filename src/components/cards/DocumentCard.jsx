import React from "react";
import {
  FileText, MapPin, Tag, Users, CalendarDays,
  Download, Trash2, Lock
} from "lucide-react";
import ActionIconButton from "@/components/buttons/ActionIconButton";

function formatDate(value) {
  const d = new Date(value);
  return isNaN(d) ? "—" : d.toLocaleDateString("fr-FR");
}

function badgeClass(ext) {
  const x = (ext || "").toLowerCase();
  if (x === "pdf") return "bg-red-50 text-red-700 ring-red-600/20";
  if (["doc", "docx"].includes(x)) return "bg-blue-50 text-blue-700 ring-blue-600/20";
  if (["xls", "xlsx", "csv"].includes(x)) return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  if (["png", "jpg", "jpeg", "webp"].includes(x)) return "bg-slate-100 text-slate-700 ring-slate-500/10";
  return "bg-gray-100 text-gray-700 ring-gray-500/10";
}

export default function DocumentCard({
  doc,
  onDownload,
  onDelete,
  className = "",
  // Only show delete when allowed
  canDelete = true,
}) {
  const ext = (doc?.name?.split(".").pop() || "").toLowerCase();
  const typeLabel = (doc?.type || ext || "Fichier").toUpperCase();

  const address = doc?.leaseId?.unitId?.propertyId?.address ?? "—";
  const city = doc?.leaseId?.unitId?.propertyId?.city ?? "—";
  const unit = doc?.leaseId?.unitId?.label ?? "—";

  // Private badge
  const isPrivate = doc?.isPrivate === true || doc?.visibility === "private";

  // get extra tenants count and names for badge and tooltip
  const tenantsArr = Array.isArray(doc?.leaseId?.tenants) ? doc.leaseId.tenants : [];
  const tenantNames = tenantsArr
    .map((t) => `${t?.userId?.profile?.firstName ?? ""} ${t?.userId?.profile?.lastName ?? ""}`.trim())
    .filter(Boolean);
  const firstTenant = tenantNames[0];
  const extraTenantNames = tenantNames.slice(1);
  const extraCount = extraTenantNames.length;

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <FileText className="w-4 h-4 text-gray-400" aria-hidden="true" />
          <span className="break-all">{doc?.name || "Document"}</span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          {isPrivate && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1
                         bg-amber-50 text-amber-700 ring-amber-600/20"
              title="Document privé"
            >
              <Lock className="w-3.5 h-3.5" />
              Privé
            </span>
          )}
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${badgeClass(ext)}`}>
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Docs infos */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>
            {address} {city !== "—" && <span className="text-gray-500">({city})</span>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span>Unité : {unit}</span>
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <Users className="w-4 h-4 text-gray-400" />

          {firstTenant ? (
            <>
              <span>Locataire : {firstTenant}</span>

              {extraCount > 0 && (
                <span className="relative group">
                  {/* Extra tenants badge */}
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={`+${extraCount} colocataire${extraCount > 1 ? "s" : ""}`}
                    className="ml-1 inline-flex items-center justify-center rounded-full bg-primary text-white px-2 py-0.5 text-xs font-medium hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    +{extraCount}
                  </button>

                  {/* Extra tenants names tooltip */}
                  <div
                    role="tooltip"
                    className="absolute left-1/2 z-10 mt-2 w-max max-w-xs -translate-x-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-lg opacity-0 pointer-events-none
                               group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    {extraTenantNames.map((name, i) => (
                      <div key={`${name}-${i}`}>{name}</div>
                    ))}
                  </div>
                </span>
              )}
            </>
          ) : (
            <span>Locataire(s) : —</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <span>Ajouté le : {formatDate(doc?.uploadedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <ActionIconButton
          label="Télécharger"
          icon={Download}
          onClick={() => onDownload?.(doc)}
          variant="primary"
        />
        <ActionIconButton
          label="Supprimer"
          icon={Trash2}
          onClick={() => onDelete?.(doc)}
          variant="danger"
          disabled={!canDelete}
          tooltipWhenDisabled={"Seul l'utilisateur ayant ajouté le document peut le supprimer"}
        />
      </div>
    </div>
  );
}
