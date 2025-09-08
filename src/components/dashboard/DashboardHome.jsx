import useAuthStore from "../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchUpcomingPayments, fetchPaymentsHistoric } from "../../api/lease";
import { fetchLeasesByRole } from "../../api/lease";
import { Plus, Building2, FileSignature, Files, CalendarClock, CalendarDays, History, ScrollText, KeyRound, MessageSquare, Users as UsersIcon, Home as HomeIcon, DollarSign } from "lucide-react";
import { ownerTemplates, tenantTemplates } from "../../constants/documentTemplates"; 
import DashboardTile from "./DashboardTile";
import KpiCard from "./KpiCard";
import { fetchPropertiesByOwner } from "../../api/property";
import { getUnitsWithLeaseCount } from "../../api/unit";
import AddPropertyModal from "../modals/AddPropertyModal";
import CreateLeaseModal from "../modals/CreateLeaseModal";
import AddDocumentModal from "../modals/AddDocumentModal";
import { fetchOwnerByUserId } from "../../api/owner";
import KpiDetailsModal from "../modals/KpiDetailsModal";

const DashboardHome = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // Owner query (for AddPropertyModal)
  const { data: owner } = useQuery({
    queryKey: ["owner", user?._id],
    queryFn: () => fetchOwnerByUserId(user._id, token),
    enabled: user?.role === "Propriétaire" && !!user?._id && !!token,
  });

  // Upcoming payments by lease query
  const { data: upcomingPayments = [] } = useQuery({
    queryKey: ["upcoming-payments"],
    queryFn: () => fetchUpcomingPayments(token),
    // Enable for both owners and tenants
    enabled: !!token,
  });

  const { data: rentHistory = [] } = useQuery({
    queryKey: ["payments-historic"],
    queryFn: () => fetchPaymentsHistoric(token),
    // Enable for both owners and tenants
    enabled: !!token,
  });

  // Leases list for modals (documents and units)
  const { data: leases = [] } = useQuery({
    queryKey: ["leases", user?._id],
    queryFn: () => fetchLeasesByRole(token),
    enabled: !!token && !!user?._id,
  });

  // Derive properties and units from leases
  const properties = Array.from(
    new Set(leases.map((l) => l.unitId?.propertyId?._id))
  )
    .map((id) =>
      leases.find((l) => l.unitId?.propertyId?._id === id)?.unitId?.propertyId
    )
    .filter(Boolean);

  const units = Array.from(new Set(leases.map((l) => l.unitId?._id)))
    .map((id) => leases.find((l) => l.unitId?._id === id)?.unitId)
    .filter(Boolean);

  // Owner's properties and all units list (for occupancy KPI)
  const { data: ownerProperties = [] } = useQuery({
    queryKey: ["owner-properties", owner?._id],
    queryFn: () => fetchPropertiesByOwner(owner._id, token),
    enabled: user?.role === "Propriétaire" && !!owner?._id && !!token,
  });

  const { data: allUnits = [] } = useQuery({
    queryKey: ["owner-all-units", owner?._id],
    queryFn: async () => {
      const lists = await Promise.all(
        ownerProperties.map((p) => getUnitsWithLeaseCount(p._id, token))
      );
      return lists.flat();
    },
    enabled: user?.role === "Propriétaire" && ownerProperties.length > 0 && !!token,
  });

  if (!user) return null;
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [addLeaseOpen, setAddLeaseOpen] = useState(false);
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);
  const [kpiOpen, setKpiOpen] = useState(false);
  const [kpiTitle, setKpiTitle] = useState("");
  const [kpiContent, setKpiContent] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Bonjour {user.profile?.firstName ?? "Utilisateur"} 👋
      </h2>

      {user.role === "Propriétaire" ? (
        <>
        {/* KPIs */}
        {(() => {
          const now = new Date();
          const isActive = (lease) => {
            const start = lease?.startDate ? new Date(lease.startDate) : null;
            const end = lease?.endDate ? new Date(lease.endDate) : null;
            if (!start) return false;
            return now >= start && (!end || now <= end);
          };

          const monthlyRent = leases
            .filter(isActive)
            .reduce((sum, l) => sum + (Number(l.rentAmount) || 0), 0);
          const fmtEUR = (v) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v || 0);

          const tenantIds = new Set(
            leases
              .filter(isActive)
              .flatMap((l) => (Array.isArray(l.tenants) ? l.tenants : []).map((t) => String(t?.userId?._id || t?._id || "")))
              .filter(Boolean)
          );
          const tenantsCount = tenantIds.size;

          const activeUnitIds = new Set(leases.filter(isActive).map((l) => String(l.unitId?._id || "")));
          const totalUnits = allUnits?.length || 0;
          const occupiedUnits = totalUnits > 0 ? [...activeUnitIds].filter((id) => allUnits.some((u) => String(u._id) === id)).length : 0;
          const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : null;

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard
                icon={<DollarSign className="w-4 h-4 text-primary" />}
                label="Loyer(s) du mois en cours"
                value={fmtEUR(monthlyRent)}
                dataTour="kpi-monthly-rent"
                onClick={() => {
                  const items = leases
                    .filter(isActive)
                    .map((l) => ({
                      id: l._id,
                      address: l.unitId?.propertyId?.address || "—",
                      unit: l.unitId?.label || "—",
                      amount: fmtEUR(l.rentAmount),
                    }));
                  setKpiTitle("Baux actifs et loyers du mois");
                  setKpiContent(
                    <ul className="space-y-2">
                      {items.length === 0 ? (
                        <li className="text-gray-500">Aucun bail actif</li>
                      ) : (
                        items.map((it) => (
                          <li
                            key={it.id}
                            onClick={() => {
                              setKpiOpen(false);
                              navigate(`/dashboard/leases?leaseId=${it.id}`);
                            }}
                            className="flex justify-between gap-3 border p-2 rounded cursor-pointer hover:bg-gray-50 transition"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setKpiOpen(false);
                                navigate(`/dashboard/leases?leaseId=${it.id}`);
                              }
                            }}
                          >
                            <span className="text-gray-700 text-sm">
                              <span className="font-medium text-primary">{it.address}</span> · <span className="italic">{it.unit}</span>
                            </span>
                            <span className="text-gray-900 font-semibold text-sm">{it.amount}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  );
                  setKpiOpen(true);
                }}
              />
              <KpiCard
                icon={<UsersIcon className="w-4 h-4 text-primary" />}
                label="Locataire(s) actifs"
                value={tenantsCount}
                dataTour="kpi-tenants-active"
                onClick={() => {
                  const names = Array.from(
                    new Set(
                      leases
                        .filter(isActive)
                        .flatMap((l) => (Array.isArray(l.tenants) ? l.tenants : [])
                          .map((t) => `${t?.userId?.profile?.firstName || ""} ${t?.userId?.profile?.lastName || ""}`.trim())
                        )
                        .filter(Boolean)
                    )
                  );
                  setKpiTitle("Locataires actifs");
                  setKpiContent(
                    <ul className="list-disc pl-5 space-y-1">
                      {names.length === 0 ? (
                        <li className="text-gray-500">Aucun locataire actif</li>
                      ) : (
                        names.map((n, i) => <li key={`${n}-${i}`}>{n}</li>)
                      )}
                    </ul>
                  );
                  setKpiOpen(true);
                }}
              />
              <KpiCard
                icon={<HomeIcon className="w-4 h-4 text-primary" />}
                label="Taux d’occupation"
                value={occupancyRate !== null ? `${occupancyRate}%` : "—"}
                hint={totalUnits ? `${occupiedUnits}/${totalUnits} unités occupées` : undefined}
                dataTour="kpi-occupancy"
                onClick={() => {
                  const occupiedIds = new Set(leases.filter(isActive).map((l) => String(l.unitId?._id || "")));
                  const byPropId = new Map(
                    (ownerProperties || []).map((p) => [String(p?._id), p])
                  );
                  const rows = (allUnits || [])
                    .filter((u) => occupiedIds.has(String(u?._id)))
                    .map((u) => {
                      const propRef = u?.propertyId;
                      const propId = typeof propRef === "object" ? (propRef?._id || propRef?.id || "") : (propRef || "");
                      const address =
                        (typeof propRef === "object" && propRef?.address) ||
                        (byPropId.get(String(propId))?.address) ||
                        "—";
                      return {
                        id: u._id,
                        unit: u?.label || "—",
                        address,
                        propertyId: String(propId),
                      };
                    });
                  setKpiTitle("Unités occupées (propriété et unité)");
                  setKpiContent(
                    <ul className="space-y-1">
                      {rows.length === 0 ? (
                        <li className="text-gray-500">Aucune unité occupée</li>
                      ) : (
                        rows.map((r) => (
                          <li
                            key={r.id}
                            onClick={() => {
                              setKpiOpen(false);
                              if (r.propertyId) {
                                navigate(`/dashboard/property/${r.propertyId}`);
                              }
                            }}
                            className="border rounded p-2 text-sm cursor-pointer hover:bg-gray-50 transition"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setKpiOpen(false);
                                if (r.propertyId) {
                                  navigate(`/dashboard/property/${r.propertyId}`);
                                }
                              }
                            }}
                          >
                            <span className="text-primary font-medium">{r.address}</span> · <span className="italic">{r.unit}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  );
                  setKpiOpen(true);
                }}
              />
            </div>
          );
        })()}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add property */}
          <DashboardTile
            dataTour="dashboard-add-property"
            title="Ajouter une propriété"
            description="Créez un nouveau bien immobilier."
            icon={<Plus className="w-5 h-5 text-primary stroke-[3]" />}
            className="cursor-pointer"
            onClick={() => setAddPropertyOpen(true)}
          />

          {/* Add Lease */}
          <DashboardTile
            dataTour="dashboard-add-lease"
            title="Ajouter un bail"
            description="Ajoutez un nouveau bail locatif."
            icon={<Plus className="w-5 h-5 text-primary stroke-[3]" />}
            className="cursor-pointer"
            onClick={() => setAddLeaseOpen(true)}
          />

          {/* Add document */}
          <DashboardTile
            dataTour="dashboard-add-document"
            title="Ajouter un document"
            description="Ajoutez un document lié à un bien."
            icon={<Plus className="w-5 h-5 text-primary stroke-[3]" />}
            className="cursor-pointer"
            onClick={() => setAddDocumentOpen(true)}
          />

          {/* My properties */}
          <DashboardTile
            to="/dashboard/properties"
            dataTour="dashboard-properties"
            title="Mes propriétés"
            description="Gérez vos biens immobiliers."
            icon={<Building2 className="w-5 h-5 text-primary" />}
          />

          {/* My leases */}
          <DashboardTile
            to="/dashboard/leases"
            dataTour="dashboard-leases"
            title="Mes baux"
            description="Suivez vos contrats et leur situation."
            icon={<FileSignature className="w-5 h-5 text-primary" />}
          />
          
          {/* Documents */}
          <DashboardTile
            to="/dashboard/documents"
            dataTour="dashboard-documents"
            title="Mes documents"
            description="Téléchargez ou visualisez vos fichiers."
            icon={<Files className="w-5 h-5 text-primary" />}
          />
          
          {/* Date payments calendar */}
          <DashboardTile dataTour="dashboard-rent-calendar" title="Calendrier des loyers" icon={<CalendarDays className="w-5 h-5 text-primary" />}>
            {upcomingPayments.length === 0 ? (
              <p className="text-sm text-gray-600">Aucune échéance à venir</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {upcomingPayments.map((lease) => (
                  <li
                    key={lease._id}
                    onClick={() => navigate(`/dashboard/leases?leaseId=${lease._id}`)}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") navigate(`/dashboard/leases?leaseId=${lease._id}`);
                    }}
                  >
                    <div className="text-primary font-medium text-sm">{lease.propertyAddress}</div>
                    <div className="text-gray-700 text-sm italic">{lease.unitLabel}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      🕓 Prochaine échéance : {" "}
                      <span className="font-semibold text-gray-800">
                        {new Date(lease.nextPaymentDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DashboardTile>
          
          {/* Leases payments historical */}
          <DashboardTile dataTour="dashboard-rent-history" title="Historique des loyers" icon={<History className="w-5 h-5 text-primary" />}>
            {rentHistory.length === 0 ? (
              <p className="text-sm text-gray-600">Aucun loyer perçu récemment</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {rentHistory.map((lease) => (
                  <li
                    key={lease._id}
                    onClick={() => navigate(`/dashboard/leases?leaseId=${lease._id}`)}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") navigate(`/dashboard/leases?leaseId=${lease._id}`);
                    }}
                  >
                    <div className="text-primary font-medium text-sm">{lease.propertyAddress}</div>
                    <div className="text-gray-700 text-sm italic">{lease.unitLabel}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      💶 Dernière échéance : {" "}
                      <span className="font-semibold text-gray-800">
                        {lease.lastPaymentDate
                          ? new Date(lease.lastPaymentDate).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Date inconnue"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DashboardTile>

          {/* Documents templates */}
          <DashboardTile dataTour="dashboard-doc-templates" title="Modèles de documents" icon={<ScrollText className="w-5 h-5 text-primary" />}>
            <ul className="space-y-1 text-sm text-primary">
              {ownerTemplates.map((doc) => (
                <li key={doc.name}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </DashboardTile>
        </div>
        <AddPropertyModal
          open={addPropertyOpen}
          onClose={() => setAddPropertyOpen(false)}
          ownerId={owner?._id}
        />
        <CreateLeaseModal
          open={addLeaseOpen}
          onClose={() => setAddLeaseOpen(false)}
          ownerId={owner?._id}
          units={units}
          properties={properties}
          token={token}
        />
        <AddDocumentModal
          open={addDocumentOpen}
          onClose={() => setAddDocumentOpen(false)}
          leases={leases}
          units={units}
          properties={properties}
        />
        <KpiDetailsModal open={kpiOpen} onClose={() => setKpiOpen(false)} title={kpiTitle}>
          {kpiContent}
        </KpiDetailsModal>
        </>
      ) : (
        <>
        {(() => {
          const now = new Date();
          const isActive = (lease) => {
            const start = lease?.startDate ? new Date(lease.startDate) : null;
            const end = lease?.endDate ? new Date(lease.endDate) : null;
            if (!start) return false;
            return now >= start && (!end || now <= end);
          };

          const fmtEUR = (v) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v || 0);

          // Rent of current month (active leases)
          const tenantMonthlyRent = leases
            .filter(isActive)
            .reduce((sum, l) => sum + (Number(l.rentAmount) || 0), 0);

          // Number of owners (active leases)
          const ownerIds = new Set(
            leases
              .filter(isActive)
              .map((l) => String(l.ownerId?._id || ""))
              .filter(Boolean)
          );
          const ownersCount = ownerIds.size;

          // Next lease end date 
          const nextEnd = leases
            .map((l) => (l.endDate ? new Date(l.endDate) : null))
            .filter((d) => d && d >= now)
            .sort((a, b) => a - b)[0] || null;
          const nextEndLabel = nextEnd ? nextEnd.toLocaleDateString("fr-FR") : "—";

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard
                icon={<DollarSign className="w-4 h-4 text-primary" />}
                label="Loyer(s) du mois en cours"
                value={fmtEUR(tenantMonthlyRent)}
                dataTour="kpi-tenant-monthly"
                onClick={() => {
                  const items = leases
                    .filter(isActive)
                    .map((l) => ({
                      id: l._id,
                      address: l.unitId?.propertyId?.address || "—",
                      unit: l.unitId?.label || "—",
                      amount: fmtEUR(l.rentAmount),
                    }));
                  setKpiTitle("Mes loyers du mois (locations en cours)");
                  setKpiContent(
                    <ul className="space-y-2">
                      {items.length === 0 ? (
                        <li className="text-gray-500">Aucun bail actif</li>
                      ) : (
                        items.map((it) => (
                          <li
                            key={it.id}
                            onClick={() => {
                              setKpiOpen(false);
                              navigate(`/dashboard/leases?leaseId=${it.id}`);
                            }}
                            className="flex justify-between gap-3 border p-2 rounded cursor-pointer hover:bg-gray-50 transition"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setKpiOpen(false);
                                navigate(`/dashboard/leases?leaseId=${it.id}`);
                              }
                            }}
                          >
                            <span className="text-gray-700 text-sm">
                              <span className="font-medium text-primary">{it.address}</span> · <span className="italic">{it.unit}</span>
                            </span>
                            <span className="text-gray-900 font-semibold text-sm">{it.amount}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  );
                  setKpiOpen(true);
                }}
              />
              <KpiCard
                icon={<UsersIcon className="w-4 h-4 text-primary" />}
                label="Propriétaire(s) actifs"
                value={ownersCount}
                dataTour="kpi-owners-active"
                onClick={() => {
                  const names = Array.from(
                    new Set(
                      leases
                        .filter(isActive)
                        .map((l) => `${l?.ownerId?.userId?.profile?.firstName || ""} ${l?.ownerId?.userId?.profile?.lastName || ""}`.trim())
                    )
                  ).filter(Boolean);
                  setKpiTitle("Mes propriétaires");
                  setKpiContent(
                    <ul className="list-disc pl-5 space-y-1">
                      {names.length === 0 ? (
                        <li className="text-gray-500">Aucun propriétaire</li>
                      ) : (
                        names.map((n, i) => <li key={`${n}-${i}`}>{n}</li>)
                      )}
                    </ul>
                  );
                  setKpiOpen(true);
                }}
              />
              <KpiCard
                icon={<CalendarClock className="w-4 h-4 text-primary" />}
                label="Fin du prochain bail"
                value={nextEndLabel}
                dataTour="kpi-next-end"
                onClick={() => {
                  const future = leases
                    .map((l) => ({ id: l._id, end: l.endDate ? new Date(l.endDate) : null, address: l.unitId?.propertyId?.address || "—", unit: l.unitId?.label || "—" }))
                    .filter((x) => x.end && x.end >= now)
                    .sort((a, b) => a.end - b.end);
                  setKpiTitle("Prochaine date de fin de location");
                  setKpiContent(
                    <ul className="space-y-1">
                      {future.length === 0 ? (
                        <li className="text-gray-500">Aucune date de fin à venir</li>
                      ) : (
                        future.map((x) => (
                          <li key={x.id} className="border rounded p-2 text-sm">
                            <span className="text-primary font-medium">{x.address}</span> · <span className="italic">{x.unit}</span>
                            <span className="float-right font-semibold">{x.end.toLocaleDateString("fr-FR")}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  );
                  setKpiOpen(true);
                }}
              />
            </div>
          );
        })()}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Leases */}
          <DashboardTile
            to="/dashboard/leases"
            dataTour="dashboard-leases"
            title="Mes Locations"
            description="Accédez aux détails de vos locations: contrat, loyers, documents."
            icon={<KeyRound className="w-5 h-5 text-primary" />}
          />
          
          {/* Chat */}
          <DashboardTile
            to="/dashboard/chat"
            dataTour="dashboard-chat-card"
            title="Contacter votre propriétaire"
            description="Posez vos questions directement à votre ou vos bailleurs."
            icon={<MessageSquare className="w-5 h-5 text-primary" />}
          />

          {/* Documents */}
          <DashboardTile
            to="/dashboard/documents"
            dataTour="dashboard-documents"
            title="Mes documents"
            description="Accédez à vos documents: bail, quittances, justificatifs etc."
            icon={<Files className="w-5 h-5 text-primary" />}
          />

          {/* Date payments calendar (tenant view) */}
          <DashboardTile dataTour="dashboard-rent-calendar" title="Calendrier des loyers" icon={<CalendarDays className="w-5 h-5 text-primary" />}>
            {upcomingPayments.length === 0 ? (
              <p className="text-sm text-gray-600">Aucune échéance à venir</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {upcomingPayments.map((lease) => (
                  <li
                    key={lease._id}
                    onClick={() => navigate(`/dashboard/leases?leaseId=${lease._id}`)}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") navigate(`/dashboard/leases?leaseId=${lease._id}`);
                    }}
                  >
                    <div className="text-primary font-medium text-sm">{lease.propertyAddress}</div>
                    <div className="text-gray-700 text-sm italic">{lease.unitLabel}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      🕓 Prochaine échéance : {" "}
                      <span className="font-semibold text-gray-800">
                        {new Date(lease.nextPaymentDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DashboardTile>

          {/* Leases payments historical (tenant view) */}
          <DashboardTile dataTour="dashboard-rent-history" title="Historique des loyers" icon={<History className="w-5 h-5 text-primary" />}>
            {rentHistory.length === 0 ? (
              <p className="text-sm text-gray-600">Aucun loyer perçu récemment</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {rentHistory.map((lease) => (
                  <li
                    key={lease._id}
                    onClick={() => navigate(`/dashboard/leases?leaseId=${lease._id}`)}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") navigate(`/dashboard/leases?leaseId=${lease._id}`);
                    }}
                  >
                    <div className="text-primary font-medium text-sm">{lease.propertyAddress}</div>
                    <div className="text-gray-700 text-sm italic">{lease.unitLabel}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      💶 Dernière échéance : {" "}
                      <span className="font-semibold text-gray-800">
                        {lease.lastPaymentDate
                          ? new Date(lease.lastPaymentDate).toLocaleDateString("fr-FR")
                          : "Date inconnue"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DashboardTile>

          {/* Documents templates (tenant view) */}
          <DashboardTile dataTour="dashboard-doc-templates" title="Modèles de documents" icon={<ScrollText className="w-5 h-5 text-primary" />}>
            <ul className="space-y-1 text-sm text-primary">
              {tenantTemplates.map((doc) => (
                <li key={doc.name}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </DashboardTile>
        </div>
        <KpiDetailsModal open={kpiOpen} onClose={() => setKpiOpen(false)} title={kpiTitle}>
          {kpiContent}
        </KpiDetailsModal>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
