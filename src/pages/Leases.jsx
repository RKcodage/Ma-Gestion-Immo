import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../stores/authStore";
import { fetchLeasesByOwner } from "../api/lease";
import { fetchOwnerByUserId } from "../api/owner"; 
import { useEffect } from "react";

export default function Leases() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const {
    data: owner,
    isLoading: ownerLoading,
    isError: ownerError,
  } = useQuery({
    queryKey: ["owner", user._id],
    queryFn: () => fetchOwnerByUserId(user._id, token),
    enabled: !!user?._id && !!token,
  });

  const {
    data: leases = [],
    isLoading: leasesLoading,
    isError: leasesError,
  } = useQuery({
    queryKey: ["leases", owner?._id],
    queryFn: () => fetchLeasesByOwner(owner._id, token),
    enabled: !!owner?._id && !!token,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (ownerLoading || leasesLoading) return <p>Chargement des baux...</p>;
  if (ownerError || leasesError) return <p>Erreur lors du chargement des données.</p>;

  return (
    <div className="px-6 py-4 space-y-4">
      <h1 className="text-2xl font-bold">Mes baux</h1>

      {leases.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun bail trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {leases.map((lease) => (
            <li key={lease._id} className="bg-white border rounded p-4 shadow-sm space-y-1">
              <p><strong>Adresse :</strong> {lease.unitId?.propertyId?.address || "-"} ({lease.unitId?.propertyId?.city || "-"})</p>
              <p><strong>Unité :</strong> {lease.unitId?.label || "-"}</p>
              <p><strong>Locataire :</strong> {lease.tenantId?.userId?.profile?.firstName} {lease.tenantId?.userId?.profile?.lastName}</p>
              <p><strong>Email :</strong> {lease.tenantId?.userId?.email}</p>
              <p><strong>Durée :</strong> {lease.startDate?.slice(0, 10)} → {lease.endDate?.slice(0, 10) || "indéfinie"}</p>
              <p><strong>Loyer :</strong> {lease.rentAmount} €</p>
              <p><strong>Charges :</strong> {lease.chargesAmount} €</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
