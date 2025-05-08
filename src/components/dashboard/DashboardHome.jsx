import useAuthStore from "../../stores/authStore";
import { Plus } from "lucide-react";
import { documentTemplates } from "../../constants/documentTemplates"; // ajuste le chemin si besoin

const DashboardHome = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Bonjour {user.profile?.firstName ?? "Utilisateur"} 👋
      </h2>

      {user.role === "Propriétaire" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cartes classiques */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter une propriété
            </h3>
            <p className="text-sm text-gray-600">Créez un nouveau bien immobilier.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter un locataire
            </h3>
            <p className="text-sm text-gray-600">Ajoutez un nouveau locataire à un bien.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Plus className="text-primary stroke-[3]" />Ajouter un document
            </h3>
            <p className="text-sm text-gray-600">Ajoutez un document lié à un bien.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Mes propriétés</h3>
            <p className="text-sm text-gray-600">Gérez vos biens immobiliers.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Locataires</h3>
            <p className="text-sm text-gray-600">Suivez vos locataires et leur situation.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <p className="text-sm text-gray-600">Téléchargez ou visualisez vos fichiers.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Calendrier des loyers</h3>
            <p className="text-sm text-gray-600">Visualisez les prochaines échéances de paiement.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Historique des loyers</h3>
            <p className="text-sm text-gray-600">Suivez les loyers perçus mois par mois.</p>
          </div>

          {/* 🆕 Modèles de documents */}
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
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Mes baux</h3>
            <p className="text-sm text-gray-600">Consultez vos baux en cours.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">Contact propriétaire</h3>
            <p className="text-sm text-gray-600">Posez vos questions directement.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
