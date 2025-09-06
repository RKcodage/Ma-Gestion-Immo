import useAuthStore from "../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUpcomingPayments, fetchPaymentsHistoric } from "../../api/lease";
import { fetchLeasesByRole } from "../../api/lease";
import { Plus, Building2, FileSignature, Files, CalendarDays, History, ScrollText, KeyRound, MessageSquare } from "lucide-react";
import { ownerTemplates, tenantTemplates } from "../../constants/documentTemplates"; 
import DashboardTile from "./DashboardTile";
import AddPropertyModal from "../modals/AddPropertyModal";
import CreateLeaseModal from "../modals/CreateLeaseModal";
import AddDocumentModal from "../modals/AddDocumentModal";
import { fetchOwnerByUserId } from "../../api/owner";

const DashboardHome = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

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

  if (!user) return null;
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [addLeaseOpen, setAddLeaseOpen] = useState(false);
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Bonjour {user.profile?.firstName ?? "Utilisateur"} 👋
      </h2>

      {user.role === "Propriétaire" ? (
        <>
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
                  <li key={lease._id} className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition">
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
                  <li key={lease._id} className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition">
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
        </>
      ) : (
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
                  <li key={lease._id} className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition">
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
                  <li key={lease._id} className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition">
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
      )}
    </div>
  );
};

export default DashboardHome;
