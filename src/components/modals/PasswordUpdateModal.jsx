import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import usePasswordVisibilityStore from "@/stores/passwordVisibilityStore";

const PasswordUpdateModal = ({ onClose, onConfirm, form, setForm, handleChange }) => {
  const visibleOld = usePasswordVisibilityStore((s) => Boolean(s.vis?.["passwordUpdate.old"]));
  const visibleNew = usePasswordVisibilityStore((s) => Boolean(s.vis?.["passwordUpdate.new"]));
  const visibleConfirm = usePasswordVisibilityStore((s) => Boolean(s.vis?.["passwordUpdate.confirm"]));
  const toggle = usePasswordVisibilityStore((s) => s.toggle);
  const resetVis = usePasswordVisibilityStore((s) => s.reset);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.oldPassword) newErrors.oldPassword = "Le mot de passe actuel est requis.";
    if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetAllVisibility = () => {
    resetVis("passwordUpdate.old");
    resetVis("passwordUpdate.new");
    resetVis("passwordUpdate.confirm");
  };

  const handleConfirm = () => {
    if (validate()) {
      resetAllVisibility();
      onConfirm();
    }
  };

  const handleClose = () => {
    resetAllVisibility();
    // Clear form fields and errors so the modal reopens blank
    try {
      setForm && setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {}
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Modifier le mot de passe</h3>

        {/* Mot de passe actuel */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
          <div className="relative">
            <input
              type={visibleOld ? "text" : "password"}
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded pr-10 ${
                errors.oldPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => toggle("passwordUpdate.old")}
              aria-label={visibleOld ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-800"
            >
              {visibleOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>

        {/* Nouveau mot de passe */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={visibleNew ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded pr-10 ${
                errors.newPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => toggle("passwordUpdate.new")}
              aria-label={visibleNew ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-800"
            >
              {visibleNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirmation mot de passe */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <div className="relative">
            <input
              type={visibleConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded pr-10 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => toggle("passwordUpdate.confirm")}
              aria-label={visibleConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-800"
            >
              {visibleConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdateModal;
