import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordUpdateModal = ({ onClose, onConfirm, form, setForm, handleChange }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.oldPassword) newErrors.oldPassword = "Le mot de passe actuel est requis.";
    if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Modifier le mot de passe</h3>

        {/* Mot de passe actuel */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
          <input
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded pr-10 ${
              errors.oldPassword ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-6 bottom-0 my-auto flex items-center text-gray-600"
          >
            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>

        {/* Nouveau mot de passe */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded pr-10 ${
              errors.newPassword ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-6 bottom-0 my-auto flex items-center text-gray-600"
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirmation mot de passe */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded pr-10 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-6 bottom-0 my-auto flex items-center text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
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
