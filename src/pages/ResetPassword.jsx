import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../stores/authStore";
import { ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <Link to="/login" className="text-sm text-primary hover:underline mb-4 inline-block">
          <ArrowLeft size={16} className="inline-block mr-1" />
          Retour à la connexion
        </Link>

        <h1 className="text-xl font-bold mb-6">Réinitialiser le mot de passe</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="newPassword"
            placeholder="Nouveau mot de passe"
            className="w-full px-4 py-2 border rounded"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            className="w-full px-4 py-2 border rounded"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
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
