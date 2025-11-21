import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../stores/authStore";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import SEO from "../components/SEO/SEO";
import usePasswordVisibilityStore from "@/stores/passwordVisibilityStore";
import { useForm } from "react-hook-form";

const Login = () => {
  const visible = usePasswordVisibilityStore((s) => Boolean(s.vis?.["login.password"]));
  const toggle = usePasswordVisibilityStore((s) => s.toggle);

  const navigate = useNavigate();
  // Use store
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const errorCode = useAuthStore((state) => state.errorCode);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const submittedRef = useRef(false);
  const emailVal = watch("email") || "";
  const passVal = watch("password") || "";

  // Handle submit 
  const onSubmit = async ({ email, password }) => {
    if (loading) return; 
    clearErrors();
    submittedRef.current = true;
    try {
      const user = await login(email, password);
      if (user?.role) navigate("/dashboard");
      else navigate("/role");
    } catch (err) {
      const msg = err?.message || "Erreur de connexion";
      if (errorCode === "RATE_LIMITED") toast.error(msg, { autoClose: 6000 });
      else toast.error("Échec de la connexion : " + msg, { autoClose: 3500 });
    }
  };

  // On mount before paint, clear store errors and RHF errors so page re-entry is clean
  useLayoutEffect(() => {
    clearErrors();
    reset();
    try {
      useAuthStore.setState({ error: null, errorCode: null });
    } catch {}
    submittedRef.current = false;
  }, [clearErrors, reset]);

  // Map serveur field errors (if any) into RHF fields
  useEffect(() => {
    if (Array.isArray(error)) {
      clearErrors();
      error.forEach((e) => {
        if (e?.field && e?.message) {
          setError(e.field, { type: "server", message: e.message });
        }
      });
    }
  }, [error, setError, clearErrors]);

  // When auth fails (wrong credentials), mark both fields as invalid to turn borders red
  useEffect(() => {
    if (submittedRef.current && typeof error === "string" && errorCode === "AUTH_FAILED") {
      setError("email", { type: "server" });
      setError("password", { type: "server" });
    }
  }, [errorCode, error, setError]);

  // If user edits fields after an auth failure, clear the server-only error for that field
  useEffect(() => {
    if (errors?.email?.type === "server" && emailVal !== "") {
      clearErrors("email");
    }
  }, [emailVal, errors?.email?.type, clearErrors]);

  useEffect(() => {
    if (errors?.password?.type === "server" && passVal !== "") {
      clearErrors("password");
    }
  }, [passVal, errors?.password?.type, clearErrors]);

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
      <div className="hidden md:block md:w-[40%] h-full">
        <img
          src="/images/login.jpg"
          alt="Login illustration"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="w-full md:w-[60%] flex flex-col items-center justify-center px-8 relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-gray-900 hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6" noValidate>
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Connexion
          </h2>

          {/* Email */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email requis",
                pattern: {
                  value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                  message: "Email invalide",
                },
              })}
              placeholder="gestion@domaine.com"
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email?.message ? "email-error" : undefined}
              className={`w-full block px-4 py-2 rounded focus:outline-none transition-colors border placeholder-gray-500 
                ${errors.email ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"}
              `}
            />
            {errors.email?.message && (
              <p id="email-error" role="alert" className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                id="password"
                {...register("password", { required: "Mot de passe requis" })}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password?.message ? "password-error" : undefined}
                className={`w-full block px-4 py-2 rounded pr-10 focus:outline-none transition-colors border placeholder-gray-500 
                  ${errors.password ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"}
                `}
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
            {errors.password?.message && (
              <p id="password-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-48 bg-primary text-white py-4 rounded-lg hover:bg-primary/90 shadow-lg transition"
            >
              {loading || isSubmitting ? "Connexion en cours..." : "Se connecter"}
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
