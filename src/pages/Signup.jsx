import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from "../stores/authStore";
import { ArrowLeft } from "lucide-react";

const Signup = () => {
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

  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      toast.success("Inscription réussie !", {
        onClose: () => navigate("/"),
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Erreur lors de l'inscription", err);
      toast.error("Échec de l'inscription : " + err.message);
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
        {/* Flèche retour */}
        <Link
          to="/"
          className="absolute top-4 left-4 text-gray-600 hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Créer un compte</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-3/4 mx-auto block px-4 py-2 border rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
            className="w-3/4 mx-auto block px-4 py-2 border rounded"
          />

          <input
            type="text"
            name="profile.firstName"
            placeholder="Prénom"
            value={form.profile.firstName}
            onChange={handleChange}
            className="w-3/4 mx-auto block px-4 py-2 border rounded"
          />

          <input
            type="text"
            name="profile.lastName"
            placeholder="Nom"
            value={form.profile.lastName}
            onChange={handleChange}
            className="w-3/4 mx-auto block px-4 py-2 border rounded"
          />

          <input
            type="text"
            name="profile.username"
            placeholder="Nom d'utilisateur"
            value={form.profile.username}
            onChange={handleChange}
            className="w-3/4 mx-auto block px-4 py-2 border rounded"
          />

          <input
            type="tel"
            name="profile.phone"
            placeholder="Téléphone"
            value={form.profile.phone}
            onChange={handleChange}
            className="w-3/4 mx-auto block px-4 py-2 border rounded"
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-48 bg-primary text-white py-4 rounded-lg hover:bg-primary/90 shadow-lg transition"
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
