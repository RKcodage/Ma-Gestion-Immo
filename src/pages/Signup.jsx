import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../stores/authStore";
import { ArrowLeft } from "lucide-react";
import { fetchInvitationByToken } from "../api/invitation";

const Signup = () => {
  const { token: invitationToken } = useParams();
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const [form, setForm] = useState({
    email: "",
    password: "",
    profile: {
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
    },
  });

  // Invitation query
  const { data: invitationData } = useQuery({
    queryKey: ["invitation", invitationToken],
    queryFn: () => fetchInvitationByToken(invitationToken),
    enabled: !!invitationToken,
  });

  // Set email if invitation exists
  useEffect(() => {
    if (invitationData?.email) {
      setForm((prev) => ({
        ...prev,
        email: invitationData.email,
      }));
    }
  }, [invitationData?.email]);
  
  
  // Get field for validation errors
  const getFieldError = (field) => {
    if (Array.isArray(error)) {
      const errObj = error.find((e) => e.field === field);
      return errObj?.message || null;
    }
    return null;
  };
  
  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form, invitationToken);
      toast.success("Inscription réussie !", {
        onClose: () => navigate("/login"),
        autoClose: 3000,
      });
    } catch (err) {
      console.log("Sign up error :", err);
      if (!Array.isArray(err.validationErrors)) {
        toast.error("Échec de l'inscription : " + err.message);
      }
    }
  };

  return (
    <div className="flex h-screen w-full">
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
          className="absolute top-4 left-4 text-gray-600 hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Créer un compte
          </h2>

          {/* Email */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full block px-4 py-2 border rounded"
              disabled={!!invitationData?.email}
            />
            {getFieldError("email") && (
              <p className="text-red-500 text-sm mt-1">{getFieldError("email")}</p>
            )}
          </div>

          {/* Password */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full block px-4 py-2 border rounded"
            />
            {getFieldError("password") && (
              <p className="text-red-500 text-sm mt-1">{getFieldError("password")}</p>
            )}
          </div>

          {/* First name */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="profile.firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              name="profile.firstName"
              id="profile.firstName"
              value={form.profile.firstName}
              onChange={handleChange}
              className="w-full block px-4 py-2 border rounded"
            />
            {getFieldError("profile.firstName") && (
              <p className="text-red-500 text-sm mt-1">{getFieldError("profile.firstName")}</p>
            )}
          </div>

          {/* Last name */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="profile.lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              name="profile.lastName"
              id="profile.lastName"
              value={form.profile.lastName}
              onChange={handleChange}
              className="w-full block px-4 py-2 border rounded"
            />
            {getFieldError("profile.lastName") && (
              <p className="text-red-500 text-sm mt-1">{getFieldError("profile.lastName")}</p>
            )}
          </div>

          {/* Username */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="profile.username" className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              name="profile.username"
              id="profile.username"
              value={form.profile.username}
              onChange={handleChange}
              className="w-full block px-4 py-2 border rounded"
            />
            {/* {getFieldError("profile.username") && (
              <p className="text-red-500 text-sm mt-1">{getFieldError("profile.username")}</p>
            )} */}
          </div>

          {/* Phone */}
          <div className="w-3/4 mx-auto">
            <label htmlFor="profile.phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              name="profile.phone"
              id="profile.phone"
              value={form.profile.phone}
              onChange={handleChange}
              className="w-full block px-4 py-2 border rounded"
            />
            {/* {getFieldError("profile.phone") && (
              <p className="text-red-500 text-sm mt-1">{getFieldError("profile.phone")}</p>
            )} */}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-48 bg-primary text-white py-4 rounded-lg hover:bg-primary/90 shadow-lg transition"
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </div>

          <p className="text-center text-sm text-primary">
            <Link to="/login" className="text-primary hover:underline">
              Déjà un compte ? Se connecter
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
