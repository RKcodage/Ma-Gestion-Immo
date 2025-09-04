import { render, screen } from "@testing-library/react";
import AddDocumentModal from "@/components/modals/AddDocumentModal";
import useAuthStore from "@/stores/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const renderWithQuery = (ui) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("AddDocumentModal – affichage selon le rôle", () => {
  const leases = [
    {
      _id: "lease123",
      unitId: { label: "T2", propertyId: { address: "12 rue des tests" } },
    },
  ];
  const units = [{ _id: "unit123", label: "T2", propertyId: { _id: "prop123" } }];
  const properties = [{ _id: "prop123", address: "12 rue des tests", city: "Paris" }];

  it("affiche les champs spécifiques au rôle Propriétaire", () => {
    useAuthStore.setState({
      token: "fake-token",
      user: { role: "Propriétaire" },
    });

    renderWithQuery(
      <AddDocumentModal
        open={true}
        onClose={() => {}}
        leases={leases}
        units={units}
        properties={properties}
      />
    );

    expect(screen.getByText("Ajouter un document")).toBeInTheDocument();
    expect(screen.getByText("-- Sélectionnez une propriété --")).toBeInTheDocument();
    expect(screen.getByText("-- Sélectionnez une unité --")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Document privé (visible uniquement par vous)")
    ).toBeInTheDocument();
  });

  it("affiche uniquement le champ bail pour le rôle Locataire", () => {
    useAuthStore.setState({
      token: "fake-token",
      user: { role: "Locataire" },
    });

    renderWithQuery(
      <AddDocumentModal
        open={true}
        onClose={() => {}}
        leases={leases}
        units={units}
        properties={properties}
      />
    );

    expect(screen.getByText("Ajouter un document")).toBeInTheDocument();
    expect(screen.getByText("-- Sélectionnez votre bail --")).toBeInTheDocument();

    // Champs non visibles pour le locataire
    expect(
      screen.queryByText("-- Sélectionnez une propriété --")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("-- Sélectionnez une unité --")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Document privé (visible uniquement par vous)")
    ).not.toBeInTheDocument();
  });
});
