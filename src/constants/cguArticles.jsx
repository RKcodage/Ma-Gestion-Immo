import React from "react";

// CGU articles content (title + children)
// Each `children` is a React node so pages can map and render directly.
export const cguArticles = [
  {
    id: "objet",
    title: "1. Objet",
    children: (
      <p>
        Les présentes conditions générales régissent l'utilisation du site <strong>Ma Gestion Immo</strong>, accessible à l'adresse {" "}
        <a href="https://ma-gestion-immo.netlify.app/" className="hover:text-primary"><em>https://ma-gestion-immo.netlify.app/</em></a>, par les utilisateurs, qu’ils soient propriétaires ou locataires.
      </p>
    ),
  },
  {
    id: "acceptation",
    title: "2. Acceptation",
    children: (
      <p>
        En accédant et en utilisant ce site, l'utilisateur accepte pleinement et sans réserve les présentes CGU. En cas de désaccord avec ces conditions, l'utilisateur doit cesser immédiatement d'utiliser la plateforme.
      </p>
    ),
  },
  {
    id: "services",
    title: "3. Services proposés",
    children: (
      <p>
        Ma Gestion Immo permet aux propriétaires de gérer leurs biens immobiliers et aux locataires de suivre leurs documents et échanges via une interface dédiée.
      </p>
    ),
  },
  {
    id: "acces",
    title: "4. Accès au service",
    children: (
      <p>
        Le site est accessible 24h/24 et 7j/7, sauf interruption pour maintenance ou cas de force majeure. L’éditeur ne peut être tenu responsable de tout dysfonctionnement ou interruption.
      </p>
    ),
  },
  {
    id: "obligations",
    title: "5. Obligations de l'utilisateur",
    children: (
      <p>
        L'utilisateur s’engage à fournir des informations exactes, à respecter la législation en vigueur, et à ne pas utiliser la plateforme à des fins frauduleuses ou illicites.
      </p>
    ),
  },
  {
    id: "donnees",
    title: "6. Données personnelles",
    children: (
      <p>
        Les données collectées sont traitées conformément au RGPD. L’utilisateur peut accéder, modifier ou supprimer ses données en contactant l’administrateur à {" "}
        <a href="mailto:contact@ma-gestion-immo.fr" className="text-blue-600 underline">contact@ma-gestion-immo.fr</a>.
      </p>
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: "7. Propriété intellectuelle",
    children: (
      <p>
        Le contenu du site (textes, images, code, etc.) est la propriété exclusive de Ma Gestion Immo. Toute reproduction est interdite sans autorisation écrite.
      </p>
    ),
  },
  {
    id: "modifications",
    title: "8. Modification des CGU",
    children: (
      <p>
        L’éditeur se réserve le droit de modifier à tout moment les présentes CGU. L'utilisateur sera informé de toute modification via une mise à jour sur le site.
      </p>
    ),
  },
  {
    id: "loi-applicable",
    title: "9. Loi applicable",
    children: (
      <p>
        Les présentes conditions sont régies par la loi française. Tout litige sera soumis à la juridiction compétente.
      </p>
    ),
  },
];

