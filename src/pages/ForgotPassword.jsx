import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../stores/authStore";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO/SEO";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const message = await forgotPassword(email);
      toast.success(message, { autoClose: 3000 });
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Page SEO */}
      <SEO
        title="Ma Gestion Immo — Mot de passe oublié"
        description="Recevez un lien pour réinitialiser votre mot de passe."
        noIndex
      />
      {/* Image */}
      <div className="w-[40%] h-full">
        <img
          src="/images/login.jpg"
          alt="Illustration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form */}
      <div className="w-[60%] flex flex-col items-center justify-center px-8 relative">
        <Link
          to="/login"
          className="absolute top-4 left-4 text-gray-600 hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Mot de passe oublié
          </h2>

          <p className="text-sm text-gray-600 text-center">
            Saisissez votre adresse email, nous vous enverrons un lien de réinitialisation.
          </p>

          <input
            type="email"
            name="email"
            id="forgot-email"
            placeholder="gestion@domaine.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!error}
            aria-describedby={error ? "forgot-error" : undefined}
            className="w-3/4 mx-auto block px-4 py-2 border rounded"
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-48 bg-primary text-white py-4 rounded-lg hover:bg-primary/90 shadow-lg transition"
            >
              {loading ? "Envoi en cours..." : "Envoyer"}
            </button>
          </div>

          {error && (
            <p id="forgot-error" role="alert" className="text-red-600 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
