import useAuthStore from "../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingPayments, fetchPaymentsHistoric } from "../../api/lease";
import { Plus } from "lucide-react";
import { documentTemplates } from "../../constants/documentTemplates"; 
import { Link } from "react-router-dom";

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
          {/* Tour anchor: add a new property */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-add-property"
          >
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter une propriété
            </h3>
            <p className="text-sm text-gray-600">Créez un nouveau bien immobilier.</p>
          </div>

          {/* Add Lease */}
          {/* Tour anchor: add a new lease */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-add-lease"
          >
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter un bail
            </h3>
            <p className="text-sm text-gray-600">Ajoutez un nouveau bail locatif.</p>
          </div>

          {/* Add document */}
          {/* Tour anchor: add a new document */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-add-document"
          >
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter un document
            </h3>
            <p className="text-sm text-gray-600">Ajoutez un document lié à un bien.</p>
          </div>

          {/* My properties */}
          <Link to="/dashboard/properties">
            {/* Tour anchor: properties listing */}
            <div
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              data-tour="dashboard-properties"
            >
              <h3 className="text-lg font-semibold mb-2">Mes propriétés</h3>
              <p className="text-sm text-gray-600">Gérez vos biens immobiliers.</p>
            </div>
          </Link>

          {/* My leases */}
          <Link to="/dashboard/leases">
            {/* Tour anchor: leases entry (shared anchor name across roles) */}
            <div
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              data-tour="dashboard-leases"
            >
              <h3 className="text-lg font-semibold mb-2">Mes baux</h3>
              <p className="text-sm text-gray-600">Suivez vos contrats et leur situation.</p>
          </div>
          </Link>
          
          {/* Documents */}
          <Link to="/dashboard/documents">
            {/* Tour anchor: documents entry (shared anchor name across roles) */}
            <div
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              data-tour="dashboard-documents"
            >
              <h3 className="text-lg font-semibold mb-2">Mes documents</h3>
              <p className="text-sm text-gray-600">Téléchargez ou visualisez vos fichiers.</p>
            </div>
          </Link>
          
          {/* Date payments calendar */}
          {/* Tour anchor: calendar of rent payments */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-rent-calendar"
          >
            <h3 className="text-lg font-semibold mb-2">📅 Calendrier des loyers</h3>
            {upcomingPayments.length === 0 ? (
              <p className="text-sm text-gray-600">Aucune échéance à venir</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {upcomingPayments.map((lease) => (
                  <li
                    key={lease._id}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="text-primary font-medium text-sm">
                      {lease.propertyAddress}
                    </div>
                    <div className="text-gray-700 text-sm italic">
                      {lease.unitLabel}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      🕓 Prochaine échéance :{" "}
                      <span className="font-semibold text-gray-800">
                        {new Date(lease.nextPaymentDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Leases payments historical */}
          {/* Tour anchor: rent payments history */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-rent-history"
          >
            <h3 className="text-lg font-semibold mb-2">📊 Historique des loyers</h3>
            {rentHistory.length === 0 ? (
              <p className="text-sm text-gray-600">Aucun loyer perçu récemment</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {rentHistory.map((lease) => (
                  <li
                    key={lease._id}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="text-primary font-medium text-sm">
                      {lease.propertyAddress}
                    </div>
                    <div className="text-gray-700 text-sm italic">
                      {lease.unitLabel}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      💶 Dernière échéance :{" "}
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
          </div>

          {/* Documents templates */}
          {/* Tour anchor: templates for common documents */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-doc-templates"
          >
            <h3 className="text-lg font-semibold mb-2">Modèles de documents</h3>
            <ul className="space-y-1 text-sm text-primary">
              {documentTemplates.map((doc) => (
                <li key={doc.name}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Leases */}
          <Link to="/dashboard/leases">
            {/* Tour anchor: leases entry (shared anchor name across roles) */}
            <div
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              data-tour="dashboard-leases"
            >
              <h3 className="text-lg font-semibold mb-2">Mes Locations</h3>
              <p className="text-sm text-gray-600">Accédez aux détails de vos locations: contrat, loyers, documents.</p>
            </div>
          </Link>
          
          {/* Chat */}
          <Link to="/dashboard/chat">
            {/* Tour anchor: chat entry card (header icon is also covered) */}
            <div
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              data-tour="dashboard-chat-card"
            >
              <h3 className="text-lg font-semibold mb-2">Contacter votre propriétaire</h3>
              <p className="text-sm text-gray-600">Posez vos questions directement à votre ou vos bailleurs.</p>
            </div>
          </Link>

          {/* Documents */}
          <Link to="/dashboard/documents">
            {/* Tour anchor: documents entry (shared anchor name across roles) */}
            <div
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              data-tour="dashboard-documents"
            >
              <h3 className="text-lg font-semibold mb-2">Mes documents</h3>
              <p className="text-sm text-gray-600">Accédez à vos documents: bail, quittances, justificatifs etc.</p>
            </div>
          </Link>

          {/* Date payments calendar (tenant view) */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-rent-calendar"
          >
            <h3 className="text-lg font-semibold mb-2">📅 Calendrier des loyers</h3>
            {upcomingPayments.length === 0 ? (
              <p className="text-sm text-gray-600">Aucune échéance à venir</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {upcomingPayments.map((lease) => (
                  <li
                    key={lease._id}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="text-primary font-medium text-sm">
                      {lease.propertyAddress}
                    </div>
                    <div className="text-gray-700 text-sm italic">
                      {lease.unitLabel}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      🕓 Prochaine échéance :{" "}
                      <span className="font-semibold text-gray-800">
                        {new Date(lease.nextPaymentDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Leases payments historical (tenant view) */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-rent-history"
          >
            <h3 className="text-lg font-semibold mb-2">📊 Historique des loyers</h3>
            {rentHistory.length === 0 ? (
              <p className="text-sm text-gray-600">Aucun loyer perçu récemment</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {rentHistory.map((lease) => (
                  <li
                    key={lease._id}
                    className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="text-primary font-medium text-sm">
                      {lease.propertyAddress}
                    </div>
                    <div className="text-gray-700 text-sm italic">
                      {lease.unitLabel}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      💶 Dernière échéance :{" "}
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
          </div>

          {/* Documents templates (tenant view) */}
          <div
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            data-tour="dashboard-doc-templates"
          >
            <h3 className="text-lg font-semibold mb-2">Modèles de documents</h3>
            <ul className="space-y-1 text-sm text-primary">
              {documentTemplates.map((doc) => (
                <li key={doc.name}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
