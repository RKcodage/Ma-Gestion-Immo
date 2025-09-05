import useAuthStore from "../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingPayments, fetchPaymentsHistoric } from "../../api/lease";
import { Plus } from "lucide-react";
import { documentTemplates } from "../../constants/documentTemplates"; 
import DashboardTile from "./DashboardTile";

const DashboardHome = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

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

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Bonjour {user.profile?.firstName ?? "Utilisateur"} 👋
      </h2>

      {user.role === "Propriétaire" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add property */}
          <DashboardTile
            dataTour="dashboard-add-property"
            title="Ajouter une propriété"
            description="Créez un nouveau bien immobilier."
            icon={<Plus className="text-primary stroke-[3]" />}
          />

          {/* Add Lease */}
          <DashboardTile
            dataTour="dashboard-add-lease"
            title="Ajouter un bail"
            description="Ajoutez un nouveau bail locatif."
            icon={<Plus className="text-primary stroke-[3]" />}
          />

          {/* Add document */}
          <DashboardTile
            dataTour="dashboard-add-document"
            title="Ajouter un document"
            description="Ajoutez un document lié à un bien."
            icon={<Plus className="text-primary stroke-[3]" />}
          />

          {/* My properties */}
          <DashboardTile
            to="/dashboard/properties"
            dataTour="dashboard-properties"
            title="Mes propriétés"
            description="Gérez vos biens immobiliers."
          />

          {/* My leases */}
          <DashboardTile
            to="/dashboard/leases"
            dataTour="dashboard-leases"
            title="Mes baux"
            description="Suivez vos contrats et leur situation."
          />
          
          {/* Documents */}
          <DashboardTile
            to="/dashboard/documents"
            dataTour="dashboard-documents"
            title="Mes documents"
            description="Téléchargez ou visualisez vos fichiers."
          />
          
          {/* Date payments calendar */}
          <DashboardTile dataTour="dashboard-rent-calendar" title="📅 Calendrier des loyers">
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
          <DashboardTile dataTour="dashboard-rent-history" title="📊 Historique des loyers">
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
          <DashboardTile dataTour="dashboard-doc-templates" title="Modèles de documents">
            <ul className="space-y-1 text-sm text-primary">
              {documentTemplates.map((doc) => (
                <li key={doc.name}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </DashboardTile>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Leases */}
          <DashboardTile
            to="/dashboard/leases"
            dataTour="dashboard-leases"
            title="Mes Locations"
            description="Accédez aux détails de vos locations: contrat, loyers, documents."
          />
          
          {/* Chat */}
          <DashboardTile
            to="/dashboard/chat"
            dataTour="dashboard-chat-card"
            title="Contacter votre propriétaire"
            description="Posez vos questions directement à votre ou vos bailleurs."
          />

          {/* Documents */}
          <DashboardTile
            to="/dashboard/documents"
            dataTour="dashboard-documents"
            title="Mes documents"
            description="Accédez à vos documents: bail, quittances, justificatifs etc."
          />

          {/* Date payments calendar (tenant view) */}
          <DashboardTile dataTour="dashboard-rent-calendar" title="📅 Calendrier des loyers">
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
          <DashboardTile dataTour="dashboard-rent-history" title="📊 Historique des loyers">
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
          <DashboardTile dataTour="dashboard-doc-templates" title="Modèles de documents">
            <ul className="space-y-1 text-sm text-primary">
              {documentTemplates.map((doc) => (
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
