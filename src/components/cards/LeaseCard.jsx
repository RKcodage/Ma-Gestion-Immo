import React from "react";
import {
  MapPin,
  Tag,
  User2,
  Mail,
  CalendarDays,
  Banknote,
  Receipt,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d) ? "—" : d.toLocaleDateString("fr-FR");
}

function fmtEUR(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function LeaseCard({
  lease,
  userRole, 
  onEdit,
  onDelete,
  onViewDocuments,
  className = "",
}) {
  const isActive = lease?.endDate ? new Date(lease.endDate) >= new Date() : true;

  const address = lease?.unitId?.propertyId?.address ?? "—";
  const city = lease?.unitId?.propertyId?.city ?? "—";
  const unitLabel = lease?.unitId?.label ?? "—";

  const tenants = Array.isArray(lease?.tenants) ? lease.tenants : [];
  const primaryTenant = tenants[0]?.userId || null;

  // Noms des locataires pour le badge + tooltip
  const tenantNames = tenants
    .map((t) => `${t?.userId?.profile?.firstName ?? ""} ${t?.userId?.profile?.lastName ?? ""}`.trim())
    .filter(Boolean);
  const extraTenantNames = tenantNames.slice(1);
  const extraCount = extraTenantNames.length;

  const owner = lease?.ownerId?.userId;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span>{address}</span>
          </div>
          <div className="text-sm text-gray-500">{city}</div>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${
            isActive
              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
              : "bg-gray-100 text-gray-600 ring-gray-500/10"
          }`}
        >
          {isActive ? "Actif" : "Terminé"}
        </span>
      </div>

      {/* Subheader */}
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
        <Tag className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <span>Unité : {unitLabel}</span>
      </div>

      {/* Infos grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {/* Personne(s) */}
        {userRole === "Locataire" ? (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <User2 className="w-4 h-4 text-gray-400" />
              <span>
                Propriétaire : {owner?.profile?.firstName} {owner?.profile?.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{owner?.email ?? "—"}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <User2 className="w-4 h-4 text-gray-400" />
              <span>
                {primaryTenant
                  ? `Locataire : ${primaryTenant.profile?.firstName ?? ""} ${primaryTenant.profile?.lastName ?? ""}`
                  : "Aucun locataire rattaché"}
              </span>

              {/* Badge + tooltip si colocs supplémentaires */}
              {extraCount > 0 && (
                <span className="relative group">
                  {/* Badge */}
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={`+${extraCount} colocataire${extraCount > 1 ? "s" : ""}`}
                    className="ml-1 inline-flex items-center justify-center rounded-full bg-primary text-white px-2 py-0.5 text-xs font-medium hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    +{extraCount}
                  </button>

                  {/* Tooltip */}
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
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{primaryTenant?.email ?? "—"}</span>
            </div>
          </>
        )}

        {/* Dates */}
        <div className="flex items-center gap-2 text-gray-700">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <span>
            {formatDate(lease?.startDate)} → {formatDate(lease?.endDate) || "indéfinie"}
          </span>
        </div>

        {/* Paiement (jour du mois) */}
        <div className="flex items-center gap-2 text-gray-700">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <span>Paiement : {lease?.paymentDate ?? "—"} du mois</span>
        </div>

        {/* Montants */}
        <div className="flex items-center gap-2 text-gray-700">
          <Banknote className="w-4 h-4 text-gray-400" />
          <span>Loyer : {fmtEUR(lease?.rentAmount)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Receipt className="w-4 h-4 text-gray-400" />
          <span>Charges : {fmtEUR(lease?.chargesAmount)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onViewDocuments?.(lease)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
          title="Voir les documents"
          aria-label="Voir les documents"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Documents</span>
        </button>

        {userRole === "Propriétaire" && (
          <button
            type="button"
            onClick={() => onEdit?.(lease)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/80"
            title="Modifier"
            aria-label="Modifier"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Modifier</span>
          </button>
        )}

        {userRole === "Propriétaire" && (
          <button
            type="button"
            onClick={() => onDelete?.(lease)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white rounded-md bg-red-600 hover:bg-red-600/80"
            title="Supprimer"
            aria-label="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Supprimer</span>
          </button>
        )}
      </div>
    </div>
  );
}
