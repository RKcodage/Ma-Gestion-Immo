import { FaBuilding, FaClipboardList, FaComments } from "react-icons/fa";

export const SERVICES = [
  {
    id: "property-management",
    title: "Gestion des biens",
    description:
      "Suivez vos propriétés, ajoutez des unités, visualisez les informations essentielles d’un coup d'œil.",
    Icon: FaBuilding,
  },
  {
    id: "document-tracking",
    title: "Suivi des documents",
    description:
      "Gérez les contrats de bail, quittances de loyer, justificatifs et autres documents importants.",
    Icon: FaClipboardList,
  },
  {
    id: "integrated-messaging",
    title: "Messagerie intégrée",
    description:
      "Échangez facilement avec vos locataires, posez des questions, réglez les problèmes sans intermédiaire.",
    Icon: FaComments,
  },
];
