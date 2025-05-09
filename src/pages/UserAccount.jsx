// ... tes imports
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../stores/authStore";
import { fetchOwnerByUserId } from "../api/owner";
import { fetchTenantByUserId } from "../api/tenant";
import { fetchUserById, uploadAvatar } from "../api/user";
import AccountUserInfos from "../components/account/AccountUserInfos";
import AccountRoleInfos from "../components/account/AccountRoleInfos";

const UserAccount = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const fileInputRef = useRef();
  const [avatarError, setAvatarError] = useState(false);

  const [form, setForm] = useState({});

  const { data: ownerData } = useQuery({
    queryKey: ["owner", user._id],
    queryFn: () => fetchOwnerByUserId(user._id, token),
    enabled: !!user._id && user.role === "Propriétaire",
  });

  const { data: tenantData } = useQuery({
    queryKey: ["tenant", user._id],
    queryFn: () => fetchTenantByUserId(user._id, token),
    enabled: !!user._id && user.role === "Locataire",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user", user._id],
    queryFn: () => fetchUserById(user._id, token),
    enabled: !!user?._id,
  });

  // Set form selon le rôle
  useEffect(() => {
    if (user.role === "Propriétaire" && ownerData) {
      setForm({
        companyName: ownerData.companyName || "",
        companyNumber: ownerData.companyNumber || "",
        companyPhone: ownerData.companyPhone || "",
        billingAddress: ownerData.billingAddress || "",
        status: ownerData.status || "",
      });
    } else if (user.role === "Locataire" && tenantData) {
      setForm({
        address: tenantData.address || "",
        birthDate: tenantData.birthDate || "",
        employmentStatus: tenantData.employmentStatus || "",
        guarantor: tenantData.guarantor || false,
        visaleGuarantee: {
          enabled: tenantData.visaleGuarantee?.enabled || false,
          contractNumber: tenantData.visaleGuarantee?.contractNumber || "",
          validityStart: tenantData.visaleGuarantee?.validityStart || "",
          validityEnd: tenantData.visaleGuarantee?.validityEnd || "",
        },
      });
    }
  }, [ownerData, tenantData, user.role]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const updated = await uploadAvatar({ file, token });

      useAuthStore.setState((state) => ({
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            avatar: updated.avatar,
          },
        },
      }));

      setAvatarError(false);
      await refetch();
    } catch (err) {
      console.error("Erreur avatar:", err.message);
    }
  };

  if (!user) return null;
  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement des informations.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Mon compte</h2>

      <AccountUserInfos
        email={data?.email}
        avatarError={avatarError}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />

      <AccountRoleInfos form={form} setForm={setForm} />
    </div>
  );
};

export default UserAccount;
