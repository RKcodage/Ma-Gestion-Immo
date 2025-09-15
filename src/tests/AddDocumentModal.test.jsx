import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("propriétaire: affiche le select 'Bail' lorsque l'unité a plusieurs baux", async () => {
    useAuthStore.setState({ token: "fake-token", user: { role: "Propriétaire" } });

    const unitId = "unit-multi";
    const multiUnits = [{ _id: unitId, label: "T3", propertyId: { _id: "prop777" } }];
    const multiProps = [{ _id: "prop777", address: "7 rue des tests", city: "Lyon" }];
    const leasesMulti = [
      {
        _id: "leaseA",
        unitId: { _id: unitId, label: "T3", propertyId: { _id: "prop777", address: "7 rue des tests" } },
        tenants: [
          { userId: { profile: { firstName: "Alice", lastName: "Durand" } } },
        ],
      },
      {
        _id: "leaseB",
        unitId: { _id: unitId, label: "T3", propertyId: { _id: "prop777", address: "7 rue des tests" } },
        tenants: [
          { userId: { profile: { firstName: "Bob", lastName: "Martin" } } },
          { userId: { profile: { firstName: "Chloé", lastName: "Leroy" } } },
        ],
      },
    ];

    renderWithQuery(
      <AddDocumentModal open={true} onClose={() => {}} leases={leasesMulti} units={multiUnits} properties={multiProps} />
    );

    // Sélectionne la propriété puis l'unité
    const propSelect = screen.getByRole("combobox", { name: "" });
    await userEvent.selectOptions(propSelect, "prop777");

    const unitSelect = screen.getByRole("combobox", { name: "", hidden: false });
    await userEvent.selectOptions(unitSelect, unitId);

    // Le select "Bail" doit apparaître quand plusieurs baux existent
    expect(screen.getByText("-- Sélectionnez le bail --")).toBeInTheDocument();

    // Et contenir les locataires dans le libellé
    expect(screen.getByText(/T3 .* Alice Durand/i)).toBeInTheDocument();
    expect(screen.getByText(/T3 .* Bob Martin, Chloé Leroy/i)).toBeInTheDocument();
  });

  it("propriétaire: ne montre pas le select 'Bail' si l'unité n'a qu'un seul bail (auto-sélection)", async () => {
    useAuthStore.setState({ token: "fake-token", user: { role: "Propriétaire" } });

    const unitId = "unit-single";
    const singleUnits = [{ _id: unitId, label: "Studio", propertyId: { _id: "prop999" } }];
    const singleProps = [{ _id: "prop999", address: "9 rue test", city: "Bordeaux" }];
    const leasesSingle = [
      {
        _id: "leaseOnly",
        unitId: { _id: unitId, label: "Studio", propertyId: { _id: "prop999", address: "9 rue test" } },
        tenants: [],
      },
    ];

    renderWithQuery(
      <AddDocumentModal open={true} onClose={() => {}} leases={leasesSingle} units={singleUnits} properties={singleProps} />
    );

    // Sélectionne la propriété puis l'unité
    const propSelect = screen.getByRole("combobox", { name: "" });
    await userEvent.selectOptions(propSelect, "prop999");

    const unitSelect = screen.getByRole("combobox", { name: "", hidden: false });
    await userEvent.selectOptions(unitSelect, unitId);

    // Pas de select "Bail" car un seul bail existe
    expect(screen.queryByText("-- Sélectionnez le bail --")).not.toBeInTheDocument();
  });
});
