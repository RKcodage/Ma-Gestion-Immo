import { BsTransparency } from "react-icons/bs";
import { MdOutlineSpeakerNotesOff } from "react-icons/md";
import { FaRepeat } from "react-icons/fa6";
import { IoDocumentsOutline } from "react-icons/io5";

export const DIFFICULTIES_ITEMS = [
  {
    id: "scattered-documents",
    Icon: IoDocumentsOutline,
    title: "Documents dispersés",
    text: "Baux, quittances, justificatifs... Trop souvent éparpillés entre mails, fichiers locaux et impressions papier.",
  },
  {
    id: "lack-of-transparency",
    Icon: BsTransparency,
    title: "Manque de transparence",
    text: "Des échanges flous, des suivis de paiement incomplets et des incompréhensions entre propriétaires et locataires.",
  },
  {
    id: "difficult-communication",
    Icon: MdOutlineSpeakerNotesOff,
    title: "Communication difficile",
    text: "Les échanges se font par email, SMS, téléphone… sans historique clair, ni centralisation.",
  },
  {
    id: "repetitive-tasks",
    Icon: FaRepeat,
    title: "Tâches manuelles répétitives",
    text: "Relances de loyer, envoi de quittances, organisation des dossiers... autant de tâches qui prennent un temps précieux.",
  },
];
