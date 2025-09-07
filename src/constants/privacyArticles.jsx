import React from "react";

export const privacyArticles = [
  {
    id: "collecte",
    title: "1. Collecte des données",
    children: (
      <p>
        Nous collectons uniquement les données nécessaires au bon fonctionnement de notre service : nom, prénom, adresse e‑mail, numéro de téléphone, données de location et documents liés aux baux.
      </p>
    ),
  },
  {
    id: "utilisation",
    title: "2. Utilisation des données",
    children: (
      <p>
        Les données sont utilisées pour vous permettre de gérer vos locations, communiquer entre utilisateurs, et générer les documents nécessaires.
      </p>
    ),
  },
  {
    id: "partage",
    title: "3. Partage des données",
    children: (
      <p>
        Aucune donnée personnelle n’est vendue ni cédée. Les données sont accessibles uniquement à l’utilisateur concerné et, le cas échéant, à l’administrateur du service à des fins de support technique.
      </p>
    ),
  },
  {
    id: "securite",
    title: "4. Stockage et sécurité",
    children: (
      <p>
        Les données sont stockées de manière sécurisée via notre base de données hébergée chez notre fournisseur d’hébergement. Toutes les communications sont chiffrées via HTTPS.
      </p>
    ),
  },
  {
    id: "droits",
    title: "5. Vos droits",
    children: (
      <p>
        Conformément au RGPD, vous avez un droit d’accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez‑nous à : {" "}
        <a href="mailto:contact@ma-gestion-immo.fr" className="text-blue-600 underline">contact@ma-gestion-immo.fr</a>.
      </p>
    ),
  },
];

