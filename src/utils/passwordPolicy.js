// Frontend copy of the backend password policy.
// Public by nature; validated authoritatively on the server.

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}\[\]~]).{8,}$/;

export const passwordRequirementsMessage =
  "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";

