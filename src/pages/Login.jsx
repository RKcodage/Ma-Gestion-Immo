import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../stores/authStore";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(form.email, form.password);
      toast.success("Connexion réussie !", { autoClose: 1000 });

      if (userData.role) {
        navigate("/dashboard");
      } else {
        navigate("/role");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion", err);
      toast.error("Échec de la connexion : " + err.message);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left image */}
      <div className="w-[40%] h-full">
        <img
          src="/images/login.jpg"
          alt="Login illustration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Login form */}
      <div className="w-[60%] flex flex-col items-center justify-center px-8 relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-gray-600 hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Se connecter
          </h2>

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

          

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-48 bg-primary text-white py-4 rounded-lg hover:bg-primary/90 shadow-lg transition"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
