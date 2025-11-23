import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../stores/authStore";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import React from "react";
import SEO from "../components/SEO/SEO";
import { passwordRegex, passwordRequirementsMessage } from "@/utils/passwordPolicy";
import usePasswordVisibilityStore from "@/stores/passwordVisibilityStore";

const ResetPassword = () => {
  const { token } = useParams();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const visibleNew = usePasswordVisibilityStore((s) => Boolean(s.vis?.["reset.new"]));
  const visibleConfirm = usePasswordVisibilityStore((s) => Boolean(s.vis?.["reset.confirm"]));
  const toggle = usePasswordVisibilityStore((s) => s.toggle);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Same regex as backend policy (shared util)
  const newVal = form.newPassword || "";
  const confirmVal = form.confirmPassword || "";
  const isNewValid = passwordRegex.test(newVal);
  const isConfirmValid = isNewValid && confirmVal.length > 0 && confirmVal === newVal;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, form.newPassword);
      toast.success("Mot de passe réinitialisé !");
      navigate("/login");
    } catch (err) {
      toast.error("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const mismatch =
    (form.newPassword?.length || 0) > 0 &&
    (form.confirmPassword?.length || 0) > 0 &&
    form.newPassword !== form.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Page SEO */}
      <SEO
        title="Ma Gestion Immo — Réinitialiser le mot de passe"
        description="Choisissez un nouveau mot de passe pour sécuriser votre compte."
        noIndex
      />
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <Link to="/login" className="text-sm text-primary hover:underline mb-4 inline-block">
          <ArrowLeft size={16} className="inline-block mr-1" />
          Retour à la connexion
        </Link>

        <h1 className="text-xl font-bold mb-6">Réinitialiser le mot de passe</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={visibleNew ? "text" : "password"}
              id="new-password"
              name="newPassword"
              placeholder="Nouveau mot de passe"
              className={`w-full px-4 py-2 rounded pr-10 focus:outline-none transition-colors border
                ${newVal && !isNewValid ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : ( isNewValid ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500" : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" )}
              `}
              value={form.newPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              aria-invalid={newVal ? !isNewValid : false}
              aria-describedby={!isNewValid && newVal ? "new-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => toggle("reset.new")}
              aria-label={visibleNew ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              {visibleNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {!isNewValid && newVal && (
            <p id="new-password-error" role="alert" className="text-sm text-red-600">
              Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
            </p>
          )}

          <div className="relative">
            <input
              type={visibleConfirm ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              className={`w-full px-4 py-2 rounded pr-10 focus:outline-none transition-colors border
                ${mismatch ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : ( isConfirmValid ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500" : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" )}
              `}
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              aria-invalid={mismatch}
              aria-describedby={mismatch ? "confirm-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => toggle("reset.confirm")}
              aria-label={visibleConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              {visibleConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {mismatch && (
            <p id="confirm-password-error" role="alert" className="text-sm text-red-600">
              Les mots de passe ne correspondent pas.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
          >
            {loading ? "Mise à jour..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
