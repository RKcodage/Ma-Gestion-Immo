import { useEffect, useMemo } from "react";
import Joyride, { STATUS, EVENTS } from "react-joyride";
import useOnboardingStore from "../../stores/onboardingStore";
import useSidebarStore from "../../stores/sidebarStore";

// Dashboard tour using React Joyride
// - Shows a short walkthrough of the main dashboard UI
// - Auto-runs on first visit (based on localStorage flag)
// - Can also be started manually from the avatar menu

const DashboardTour = () => {
  const run = useOnboardingStore((s) => s.dashboardTourRun);
  const hasSeen = useOnboardingStore((s) => s.dashboardTourHasSeen);
  const start = useOnboardingStore((s) => s.startDashboardTour);
  const stop = useOnboardingStore((s) => s.stopDashboardTour);
  const setSeen = useOnboardingStore((s) => s.setDashboardTourSeen);

  const openSidebar = useSidebarStore((s) => s.openSidebar);


  // Define steps using data-tour selectors added across the UI
  const steps = useMemo(
    () => [
      // Welcome step on the header title
      {
        target: "[data-tour='header-title']",
        content:
          "Bienvenue sur Ma Gestion Immo. Suivez ce tutoriel pour découvrir l'application.",
        placement: "bottom",
        disableBeacon: true,
      },
      {
        target: "[data-tour='header-menu']",
        content:
          "Utilisez ce bouton pour ouvrir ou fermer le panneau latéral et accéder aux différents menus.",
        disableBeacon: true,
        placement: "bottom",
      },
      {
        target: "[data-tour='sidebar']",
        content:
          "Ici, accédez rapidement à vos sections principales (Tableau de bord, Propriétés, Baux, Documents).",
        placement: "right",
      },
      {
        target: "[data-tour='chat-button']",
        content:
          "Discutez avec vos interlocuteurs. Un badge vous indique les messages non lus.",
        placement: "bottom",
      },
      {
        target: "[data-tour='notifications-button']",
        content:
          "Consultez vos notifications importantes. Cliquez pour voir les détails et accéder aux pages associées.",
        placement: "bottom",
      },
      {
        target: "[data-tour='avatar-button']",
        content:
          "Gérez votre compte et déconnectez-vous depuis ce menu.",
        placement: "bottom",
      },
      // KPI cards (skipped automatically if not present)
      {
        target: "[data-tour='kpi-monthly-rent']",
        content:
          "Total des loyers du mois en cours.",
        placement: "top",
      },
      {
        target: "[data-tour='kpi-tenants-active']",
        content:
          "Nombre de locataires actifs liés à vos baux en cours.",
        placement: "top",
      },
      {
        target: "[data-tour='kpi-occupancy']",
        content:
          "Taux d’occupation de vos unités (occupées / totales).",
        placement: "top",
      },
      {
        target: "[data-tour='kpi-tenant-monthly']",
        content:
          "Montant cumulé de vos loyers du mois en cours.",
        placement: "top",
      },
      {
        target: "[data-tour='kpi-owners-active']",
        content:
          "Nombre de propriétaires auxquels vous êtes rattaché pour vos locations en cours.",
        placement: "top",
      },
      {
        target: "[data-tour='kpi-next-end']",
        content:
          "Prochaine date de fin parmi vos locations en cours.",
        placement: "top",
      },
      // Dashboard tiles — iterate left-to-right per row
      // Owner (row 1): add property -> add lease -> add document
      {
        target: "[data-tour='dashboard-add-property']",
        content:
          "Créez une propriété et ajoutez-lui une unité pour pouvoir créer un bail.",
        placement: "top",
      },
      {
        target: "[data-tour='dashboard-add-lease']",
        content: "Ajoutez un nouveau bail et définissez ses paramètres.",
        placement: "top",
      },
      {
        target: "[data-tour='dashboard-add-document']",
        content: "Ajoutez facilement des documents liés à vos biens ou baux.",
        placement: "top",
      },
      // Owner (row 2) / Tenant (row 1): left -> right
      {
        target: "[data-tour='dashboard-properties']",
        content: "Visualisez et gérez vos propriétés depuis cette section.",
        placement: "top",
      },
      {
        target: "[data-tour='dashboard-leases']",
        content:
          "Accédez à vos baux depuis cette tuile pour consulter et gérer les contrats.",
        placement: "top",
      },
      {
        target: "[data-tour='dashboard-chat-card']",
        content:
          "Ouvrez la messagerie pour échanger avec votre interlocuteur.",
        placement: "top",
      },
      {
        target: "[data-tour='dashboard-documents']",
        content:
          "Retrouvez ici tous vos documents, téléversements et téléchargements.",
        placement: "top",
      },
      // Owner (row 3): left -> right
      {
        target: "[data-tour='dashboard-rent-calendar']",
        content:
          "Consultez les prochaines échéances de loyer dans ce calendrier.",
        placement: "top",
      },
      {
        target: "[data-tour='dashboard-rent-history']",
        content: "Visualisez l’historique des loyers perçus récemment.",
        placement: "top",
      },
      {
        target: "[data-tour='dashboard-doc-templates']",
        content: "Accédez à des modèles de documents utiles prêts à l’emploi.",
        placement: "top",
      },
    ],
    []
  );

  // Auto-run once per user/environment if not seen yet
  useEffect(() => {
    // Only auto-start if not already seen and not already running
    if (!hasSeen && !run) {
      start();
    }
    // Do not include `start` to avoid re-trigger; we only want to check values
  }, [hasSeen, run]);

  const handleCallback = (data) => {
    const { status, index, type } = data;

    // Ensure the sidebar is visible when we are about to show the sidebar step
    if (type === EVENTS.STEP_BEFORE) {
      const step = steps[index];
      if (step?.target === "[data-tour='sidebar']") {
        openSidebar();
      }
    }

    // When tour ends or is skipped, mark as seen and stop
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setSeen(true);
      stop();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      disableOverlayClose
      scrollToFirstStep
      styles={{
        options: {
          // Use project theme colors (CSS variables)
          primaryColor: "hsl(var(--primary))",
          textColor: "hsl(var(--foreground))",
          zIndex: 10000,
        },
        buttonBack: {
          // Back link color
          color: "hsl(var(--muted-foreground))",
        },
        buttonNext: {
          // Next button background and text
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
        buttonClose: {
          color: "hsl(var(--muted-foreground))",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
      }}
      locale={{
        back: "Retour",
        close: "Fermer",
        last: "Terminer",
        next: "Suivant",
        skip: "Passer",
      }}
      callback={handleCallback}
    />
  );
};

export default DashboardTour;
