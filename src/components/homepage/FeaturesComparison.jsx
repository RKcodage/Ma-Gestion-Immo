import React from "react";
import { Check, X } from "lucide-react";

const Yes = () => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
    <Check className="w-4 h-4" />
  </span>
);

const No = () => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white">
    <X className="w-4 h-4" />
  </span>
);

const rows = [
  {
    label: "Créer, éditer et supprimer des propriétés",
    owner: true,
    tenant: false,
  },
  {
    label: "Créer, éditer et supprimer des unités",
    owner: true,
    tenant: false,
  },
  {
    label: "Créer et gérer des baux",
    owner: true,
    tenant: false,
  },
  {
    label: "Consulter ses baux et locations",
    owner: true,
    tenant: true,
  },
  {
    label: "Ajouter / télécharger des documents",
    owner: true,
    tenant: true,
  },
  {
    label: "Messagerie en temps réel",
    owner: true,
    tenant: true,
  },
  {
    label: "Échéances et historique des paiements",
    owner: true,
    tenant: true,
  },
  {
    label: "Notifications et rappels",
    owner: true,
    tenant: true,
  },
];

export default function FeaturesComparison() {
  return (
    <section className="py-20 px-6 md:px-16 bg-gray-100 text-gray-800">
      
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Des fonctionnalités adaptées à vos besoins</h2>
        <p className="text-gray-600 text-lg">
          Les fonctionnalités disponibles diffèrent selon que vous soyez <strong>Propriétaire</strong> ou <strong>Locataire</strong>.
        </p>
      </div>

      {/* Carte de comparaison */}
      <div className="max-w-5xl mx-auto bg-white border rounded-xl shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 px-6 py-3 text-sm font-medium text-gray-600 bg-gray-50">
          <div>Fonctionnalité</div>
          <div className="hidden sm:block text-center">Propriétaire</div>
          <div className="hidden sm:block text-center">Locataire</div>
        </div>

        <div className="divide-y">
          {rows.map((r, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 items-center px-6 py-4">
              <div className="text-gray-800 text-sm sm:text-base mb-3 sm:mb-0">{r.label}</div>
              <div className="flex sm:justify-center items-center gap-2">
                <span className="sm:hidden text-xs text-gray-500 mr-2">Propriétaire</span>
                {r.owner ? <Yes /> : <No />}
              </div>
              <div className="flex sm:justify-center items-center gap-2 mt-2 sm:mt-0">
                <span className="sm:hidden text-xs text-gray-500 mr-2">Locataire</span>
                {r.tenant ? <Yes /> : <No />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
