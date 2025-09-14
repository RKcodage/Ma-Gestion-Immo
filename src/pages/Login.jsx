import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../stores/authStore";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import SEO from "../components/SEO/SEO";
import usePasswordVisibilityStore from "@/stores/passwordVisibilityStore";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const visible = usePasswordVisibilityStore((s) => Boolean(s.vis?.["login.password"]));
  const toggle = usePasswordVisibilityStore((s) => s.toggle);

  const navigate = useNavigate();
  // Use store
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const errorCode = useAuthStore((state) => state.errorCode);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; 
  
    try {
      const user = await login(form.email, form.password);
  
      if (user?.role) {
        navigate("/dashboard");
      } else {
        navigate("/role");
      }
    } catch (err) {
      const msg = err?.message || "Erreur de connexion";
  
      if (errorCode === "RATE_LIMITED") {
        toast.error(msg, { autoClose: 6000 });
      } else {
        toast.error("Échec de la connexion : " + msg, { autoClose: 3500 });
      }
    }
  };

  // Get field for validation errors
  const getFieldError = (field) => {
    if (Array.isArray(error)) {
      const errObj = error.find((e) => e.field === field);
      return errObj?.message || null;
    }
    return null;
  };

  return (
    <div className="flex h-screen w-full">
      {/* Page SEO */}
      <SEO
        title="Ma Gestion Immo — Connexion"
        description="Connectez-vous pour gérer vos biens, baux et documents locatifs."
        noIndex
      />
      {/* Left image */}
      <div className="w-[40%] h-full">
        <img
          src="/images/login.jpg"
          alt="Login illustration"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="w-[60%] flex flex-col items-center justify-center px-8 relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-gray-600 hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Connexion
          </h2>

          {/* Email */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="gestion@domaine.com"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!getFieldError("email")}
              aria-describedby={getFieldError("email") ? "email-error" : undefined}
              className="w-full block px-4 py-2 border rounded"
            />
            {getFieldError("email") && (
              <p id="email-error" role="alert" className="text-red-500 text-sm mt-1">{getFieldError("email")}</p>
            )}
          </div>

          {/* Password */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!getFieldError("password")}
                aria-describedby={getFieldError("password") ? "password-error" : undefined}
                className="w-full block px-4 py-2 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => toggle("login.password")}
                aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {getFieldError("password") && (
              <p id="password-error" role="alert" className="text-red-500 text-sm mt-1">
                {getFieldError("password")}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-48 bg-primary text-white py-4 rounded-lg hover:bg-primary/90 shadow-lg transition"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>

          <p className="text-center text-sm text-primary">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
          </p>

          {typeof error === "string" && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
