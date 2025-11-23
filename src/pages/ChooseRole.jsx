import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAssignRole } from "../stores/roleStore";
import useAuthStore from "../stores/authStore";
import SEO from "../components/SEO/SEO";

const ChooseRole = () => {
  const navigate = useNavigate();
  const assignRoleMutation = useAssignRole();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.role === "Propriétaire") {
      navigate("/owner");
    } else if (user?.role === "Locataire") {
      navigate("/tenant");
    }
  }, [user, navigate]);

  if (user?.role) return null;

  const handleRoleSelect = async (role) => {
    assignRoleMutation.mutate(role, {
      onSuccess: (data) => {
        toast.success("Rôle assigné avec succès !");
        if (role === "Propriétaire" || role === "Locataire") navigate("/dashboard");
      },
      onError: (error) => {
        toast.error(error.message);
        console.error("Assignation échouée :", error);
      },
    });
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-10 bg-gray-50 px-4">
      {/* Page SEO */}
      <SEO
        title="Ma Gestion Immo — Choisissez votre rôle"
        description="Sélectionnez votre rôle pour personnaliser votre espace."
        noIndex
      />
      <h2 className="text-5xl font-extrabold text-gray-800">Choisissez votre rôle</h2>

      <div className="flex gap-10">
        <button
          onClick={() => handleRoleSelect("Propriétaire")}
          className="bg-primary text-white px-10 py-4 rounded-xl shadow-xl hover:bg-primary/90 transition text-xl"
        >
          Propriétaire
        </button>

        <button
          onClick={() => handleRoleSelect("Locataire")}
          className="bg-primary text-white px-10 py-4 rounded-xl shadow-xl hover:bg-primary/90 transition text-xl"
        >
          Locataire
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;
