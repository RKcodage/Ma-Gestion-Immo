import React, { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../stores/authStore";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { fetchInvitationByToken } from "../api/invitation";
import SEO from "../components/SEO/SEO";
import usePasswordVisibilityStore from "@/stores/passwordVisibilityStore";
import { passwordRegex, passwordRequirementsMessage } from "@/utils/passwordPolicy";
import { useForm } from "react-hook-form";

const Signup = () => {
  const { token: invitationToken } = useParams();
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const visible = usePasswordVisibilityStore((s) => Boolean(s.vis?.["signup.password"]));
  const toggle = usePasswordVisibilityStore((s) => s.toggle);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      profile: { firstName: "", lastName: "", username: "", phone: "" },
    },
  });
  const emailVal = watch("email") || "";
  const passVal = watch("password") || "";
  const firstVal = watch("profile.firstName") || "";
  const lastVal = watch("profile.lastName") || "";
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  const isEmailValid = emailRegex.test(emailVal);
  const isPassValid = passwordRegex.test(passVal) && !errors.password;

  // Invitation query
  const { data: invitationData } = useQuery({
    queryKey: ["invitation", invitationToken],
    queryFn: () => fetchInvitationByToken(invitationToken),
    enabled: !!invitationToken,
  });

  // Set email if invitation exists
  useEffect(() => {
    if (invitationData?.email) {
      setValue("email", invitationData.email, { shouldValidate: true });
    }
  }, [invitationData?.email, setValue]);
  
  
  // Get field error returned from server
  const getFieldError = (field) => {
    if (Array.isArray(error)) {
      const errObj = error.find((e) => e.field === field);
      return errObj?.message || null;
    }
    return null;
  };

  // Handle submit
  const onSubmit = async (data) => {
    try {
      await signup(data, invitationToken);
      toast.success("Inscription réussie !", {
        onClose: () => navigate("/login"),
        autoClose: 3000,
      });
      reset();
    } catch (err) {
      console.log("Sign up error :", err);
      if (Array.isArray(err?.validationErrors)) {
        clearErrors();
        err.validationErrors.forEach((e) => {
          if (e?.field && e?.message) {
            setError(e.field, { type: "server", message: e.message });
          }
        });
      } else {
        toast.error("Échec de l'inscription : " + err.message);
      }
    }
  };

  // Also map store errors array, if present
  useEffect(() => {
    if (Array.isArray(error)) {
      clearErrors();
      error.forEach((e) => {
        if (e?.field && e?.message) setError(e.field, { type: "server", message: e.message });
      });
    }
  }, [error, setError, clearErrors]);

  return (
    <div className="flex h-screen w-full">
      {/* Page SEO */}
      <SEO
        title="Ma Gestion Immo — Inscription"
        description="Créez votre compte pour centraliser vos documents, baux et échanges."
        noIndex
      />
      {/* Left image */}
      <div className="w-[40%] h-full">
        <img
          src="/images/signup.jpg"
          alt="Signup illustration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Signup form */}
      <div className="w-[60%] flex flex-col items-center justify-center px-8 relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-gray-900 hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6" noValidate>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Créer un compte
          </h2>

          {/* Email */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-disabled={!!invitationData?.email}
              className={`w-full block px-4 py-2 rounded focus:outline-none transition-colors border placeholder-gray-500 
                ${errors.email ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : ( isEmailValid ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500" : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" )}
              `}
              disabled={!!invitationData?.email}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                id="password"
                {...register("password", {
                  required: "Mot de passe requis",
                  pattern: { value: passwordRegex, message: passwordRequirementsMessage },
                })}
                placeholder="Créez un mot de passe"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`w-full block px-4 py-2 rounded pr-10 focus:outline-none transition-colors border placeholder-gray-500 
                  ${errors.password ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" : ( isPassValid ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500" : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" )}
                `}
              />
              <button
                type="button"
                onClick={() => toggle("signup.password")}
                aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* First name */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="profile.firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              id="profile.firstName"
              {...register("profile.firstName", { required: "Le prénom est requis" })}
              placeholder="John"
              autoComplete="given-name"
              aria-invalid={!!errors?.profile?.firstName}
              aria-describedby={errors?.profile?.firstName ? "profile.firstName-error" : undefined}
              className={`w-full block px-4 py-2 rounded focus:outline-none transition-colors border placeholder-gray-500 
                ${errors?.profile?.firstName
                  ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : firstVal
                  ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"}
              `}
            />
            {errors?.profile?.firstName && (
              <p id="profile.firstName-error" role="alert" className="text-red-500 text-sm mt-1">{errors.profile.firstName.message}</p>
            )}
          </div>

          {/* Last name */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="profile.lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              id="profile.lastName"
              {...register("profile.lastName", { required: "Le nom est requis" })}
              placeholder="Doe"
              autoComplete="family-name"
              aria-invalid={!!errors?.profile?.lastName}
              aria-describedby={errors?.profile?.lastName ? "profile.lastName-error" : undefined}
              className={`w-full block px-4 py-2 rounded focus:outline-none transition-colors border placeholder-gray-500 
                ${errors?.profile?.lastName
                  ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : lastVal
                  ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"}
              `}
            />
            {errors?.profile?.lastName && (
              <p id="profile.lastName-error" role="alert" className="text-red-500 text-sm mt-1">{errors.profile.lastName.message}</p>
            )}
          </div>

          {/* Username removed (optional in schema) */}

          {/* Phone removed (optional in schema) */}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-48 bg-primary text-white py-4 rounded-lg hover:bg-primary/90 shadow-lg transition"
            >
              {loading || isSubmitting ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </div>

          <p className="text-center text-sm text-primary">
            <Link to="/login" className="text-primary hover:underline">
              Déjà un compte ? Se connecter.
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

export default Signup;
