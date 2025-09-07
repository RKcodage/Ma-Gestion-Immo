import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// Stores
import useAuthStore from "../stores/authStore";
// Api
import { fetchOwnerByUserId } from "../api/owner";
import { fetchTenantByUserId } from "../api/tenant";
import { fetchUserById, uploadAvatar } from "../api/user";
// SEO
import SEO from "../components/SEO/SEO";
// Components
import AccountUserInfos from "../components/account/AccountUserInfos";
import AccountRoleInfos from "../components/account/AccountRoleInfos";
import { ArrowLeft } from "lucide-react";

const UserAccount = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [avatarError, setAvatarError] = useState(false);

  const [form, setForm] = useState({});
  const [initialRoleForm, setInitialRoleForm] = useState({});

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

  // Set form depends on user role 
  useEffect(() => {
    if (user.role === "Propriétaire" && ownerData) {
      const next = {
        companyName: ownerData.companyName || "",
        companyNumber: ownerData.companyNumber || "",
        companyPhone: ownerData.companyPhone || "",
        billingAddress: ownerData.billingAddress || "",
        status: ownerData.status || "",
      };
      setForm(next);
      setInitialRoleForm(next);
    } else if (user.role === "Locataire" && tenantData) {
      const next = {
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
      };
      setForm(next);
      setInitialRoleForm(next);
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
      {/* Page SEO */}
      <SEO title="Ma Gestion Immo - Mon Compte" noIndex />
      
      {/* Page title with back arrow */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Retour"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold">Mon compte</h2>
      </div>

      {/* User infos */}
      <AccountUserInfos
        email={data?.email}
        avatarError={avatarError}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />

      {/* User role infos */}
      <AccountRoleInfos form={form} setForm={setForm} initialForm={initialRoleForm} />
    </div>
  );
};

export default UserAccount;
