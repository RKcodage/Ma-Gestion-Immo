import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-40">
      <h1 className="text-white text-2xl font-bold">Ma Gestion Immo</h1>
      <div className="space-x-6 flex items-center">
        {/* <NavLink
          to="/signup"
          className="text-white hover:underline text-lg underline-offset-4"
        >
          Inscription
        </NavLink> */}
        <NavLink
  to="/login"
  className="flex items-center gap-2 text-white text-lg hover:underline underline-offset-4"
>
  Se connecter
  <span className="w-6 h-6 flex items-center justify-center rounded-full border border-white">
    <User size={14} />
  </span>
</NavLink>
      </div>
    </header>
  );
};

export default Header;
