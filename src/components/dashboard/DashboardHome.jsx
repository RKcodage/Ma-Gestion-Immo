import useAuthStore from "../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingPayments } from "../../api/lease";
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
    enabled: user?.role === "Propriétaire" && !!token,
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
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter une propriété
            </h3>
            <p className="text-sm text-gray-600">Créez un nouveau bien immobilier.</p>
          </div>

          {/* Add Lease */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter un bail
            </h3>
            <p className="text-sm text-gray-600">Ajoutez un nouveau bail locatif.</p>
          </div>

          {/* Add document */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter un document
            </h3>
            <p className="text-sm text-gray-600">Ajoutez un document lié à un bien.</p>
          </div>

          {/* My properties */}
          <Link to="/dashboard/properties">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">Mes propriétés</h3>
              <p className="text-sm text-gray-600">Gérez vos biens immobiliers.</p>
            </div>
          </Link>

          {/* My leases */}
          <Link to="/dashboard/leases">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">Mes baux</h3>
              <p className="text-sm text-gray-600">Suivez vos contrats et leur situation.</p>
          </div>
          </Link>
          
          {/* Documents */}
          <Link to="/dashboard/documents">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">Mes documents</h3>
              <p className="text-sm text-gray-600">Téléchargez ou visualisez vos fichiers.</p>
            </div>
          </Link>
          
          {/* Date payments calendar */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
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
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Historique des loyers</h3>
            <p className="text-sm text-gray-600">Suivez les loyers perçus mois par mois.</p>
          </div>

          {/* Documents templates */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
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
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">Mes baux</h3>
              <p className="text-sm text-gray-600">Consultez vos baux en cours.</p>
            </div>
          </Link>
          
          {/* Chat */}
          <Link to="/dashboard/chat">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">Contacter votre propriétaire</h3>
              <p className="text-sm text-gray-600">Posez vos questions directement.</p>
            </div>
          </Link>

          {/* Documents */}
          <Link to="/dashboard/documents">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">Mes documents</h3>
              <p className="text-sm text-gray-600">Téléchargez ou visualisez vos fichiers.</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
